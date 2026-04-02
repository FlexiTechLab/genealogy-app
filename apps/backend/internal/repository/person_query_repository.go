package repository

import (
	"context"
	"errors"
	"fmt"
	"math"

	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/domain"
	"github.com/FlexiTechLab/genealogy-app/apps/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ==================================================
// INTERFACE
// ==================================================

type PersonQueryRepository interface {
	// Filter & Search
	FilterPersons(ctx context.Context, req domain.PersonFilterRequest) (*domain.PaginatedPersons, error)
	GetAllFamilyMembers(ctx context.Context, treeID uuid.UUID) ([]domain.PersonSummary, error)

	// Get Person Detail (Parents, Spouses, Children, Siblings)
	GetPersonDetail(ctx context.Context, treeID, personID uuid.UUID) (*domain.PersonDetail, error)

	// Get Full Lineage (Ancestors + Descendants) from a specific person
	GetLineageFromPerson(ctx context.Context, treeID, personID uuid.UUID, ancestorDepth, descendantDepth int) (*domain.LineageResult, error)

	// Calculate relationship/naming between two people
	GetRelationship(ctx context.Context, treeID, personAID, personBID uuid.UUID) (*domain.RelationshipPath, error)
}

// ==================================================
// IMPLEMENTATION
// ==================================================

type personQueryRepository struct {
	db *gorm.DB
}

func NewPersonQueryRepository(db *gorm.DB) PersonQueryRepository {
	return &personQueryRepository{db: db}
}

// ==================================================
// FilterPersons - Filter and Search logic
// ==================================================

func (r *personQueryRepository) FilterPersons(ctx context.Context, req domain.PersonFilterRequest) (*domain.PaginatedPersons, error) {
	query := r.db.WithContext(ctx).Model(&models.Person{})

	if req.TreeID != "" {
		treeID, err := uuid.Parse(req.TreeID)
		if err != nil {
			return nil, fmt.Errorf("tree_id không hợp lệ: %w", err)
		}
		query = query.Where("tree_id = ?", treeID)
	}

	if req.BranchID != "" {
		branchID, err := uuid.Parse(req.BranchID)
		if err != nil {
			return nil, fmt.Errorf("branch_id không hợp lệ: %w", err)
		}
		query = query.Where("branch_id = ?", branchID)
	}

	if req.Gender != nil {
		query = query.Where("gender = ?", *req.Gender)
	}
	if req.IsAlive != nil {
		query = query.Where("is_alive = ?", *req.IsAlive)
	}
	if req.GenerationNumber != nil {
		query = query.Where("generation_number = ?", *req.GenerationNumber)
	}
	if req.FullName != "" {
		query = query.Where("full_name ILIKE ?", "%"+req.FullName+"%")
	}

	var totalCount int64
	if err := query.Count(&totalCount).Error; err != nil {
		return nil, err
	}

	// Pagination logic
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 || req.PageSize > 100 {
		req.PageSize = 20
	}
	offset := (req.Page - 1) * req.PageSize

	var persons []models.Person
	if err := query.
		Order("generation_number ASC, birth_order ASC").
		Limit(req.PageSize).
		Offset(offset).
		Find(&persons).Error; err != nil {
		return nil, err
	}

	if len(persons) == 0 {
		return &domain.PaginatedPersons{Items: []domain.PersonSummary{}, TotalCount: 0}, nil
	}

	// HANDLING POLYGAMY IN THE LIST
	personIDs := make([]uuid.UUID, len(persons))
	for i, p := range persons {
		personIDs[i] = p.ID
	}

	// Query all marriages related to these people
	var marriages []models.Marriage
	r.db.WithContext(ctx).
		Where("husband_id IN ? OR wife_id IN ?", personIDs, personIDs).
		Order("marriage_order ASC").
		Find(&marriages)

	// Gather all necessary Spouse IDs to retrieve the FullName (avoid N+1 queries)
	neededSpouseIDs := make(map[uuid.UUID]bool)
	for _, m := range marriages {
		neededSpouseIDs[m.HusbandID] = true
		neededSpouseIDs[m.WifeID] = true
	}

	var spouseList []models.Person
	uniqueSpouseIDs := []uuid.UUID{}
	for id := range neededSpouseIDs {
		uniqueSpouseIDs = append(uniqueSpouseIDs, id)
	}
	r.db.WithContext(ctx).Where("id IN ?", uniqueSpouseIDs).Find(&spouseList)

	// Map for quick access to information about Spouse
	spouseInfoMap := make(map[uuid.UUID]domain.SpouseShortInfo)
	for _, s := range spouseList {
		spouseInfoMap[s.ID] = domain.SpouseShortInfo{
			ID: s.ID, FullName: s.FullName, Gender: s.Gender,
		}
	}

	// Build SpouseMap: PersonID -> []SpouseShortInfo
	spouseMap := make(map[uuid.UUID][]domain.SpouseShortInfo)
	for _, m := range marriages {
		// If the husband is on the original list, add the wife
		if _, ok := neededSpouseIDs[m.HusbandID]; ok {
			if wifeInfo, exists := spouseInfoMap[m.WifeID]; exists {
				spouseMap[m.HusbandID] = append(spouseMap[m.HusbandID], wifeInfo)
			}
		}
		// If the wife is in the original list, add the husband
		if _, ok := neededSpouseIDs[m.WifeID]; ok {
			if husbandInfo, exists := spouseInfoMap[m.HusbandID]; exists {
				spouseMap[m.WifeID] = append(spouseMap[m.WifeID], husbandInfo)
			}
		}
	}

	items := make([]domain.PersonSummary, len(persons))
	for i, p := range persons {
		summary := toPersonSummary(p)
		summary.Spouses = spouseMap[p.ID]
		items[i] = summary
	}

	return &domain.PaginatedPersons{
		Items:      items,
		TotalCount: totalCount,
		Page:       req.Page,
		PageSize:   req.PageSize,
		TotalPages: int(math.Ceil(float64(totalCount) / float64(req.PageSize))),
	}, nil
}

func (r *personQueryRepository) GetAllFamilyMembers(ctx context.Context, treeID uuid.UUID) ([]domain.PersonSummary, error) {
    var persons []models.Person
    // Get all members in the tree
    if err := r.db.WithContext(ctx).Where("tree_id = ?", treeID).Find(&persons).Error; err != nil {
        return nil, err
    }

    personMap := make(map[uuid.UUID]*domain.PersonSummary)
    for _, p := range persons {
        summary := toPersonSummary(p)
        summary.Spouses = []domain.SpouseShortInfo{}
        personMap[p.ID] = &summary
    }

    // Use marriage information to attach Spouses to each person.
    var marriages []models.Marriage
    r.db.WithContext(ctx).Where("tree_id = ?", treeID).Find(&marriages)

    for _, m := range marriages {
        if h, ok := personMap[m.HusbandID]; ok {
            if w, okW := personMap[m.WifeID]; okW {
                h.Spouses = append(h.Spouses, domain.SpouseShortInfo{ID: w.ID, FullName: w.FullName, Gender: w.Gender})
                w.Spouses = append(w.Spouses, domain.SpouseShortInfo{ID: h.ID, FullName: h.FullName, Gender: h.Gender})
            }
        }
    }

    // Convert the map to a slice.
    result := make([]domain.PersonSummary, 0, len(personMap))
    for _, p := range persons {
        result = append(result, *personMap[p.ID])
    }
    return result, nil
}

// ==================================================
// GetPersonDetail
// ==================================================

func (r *personQueryRepository) GetPersonDetail(ctx context.Context, treeID, personID uuid.UUID) (*domain.PersonDetail, error) {
	var person models.Person
	if err := r.db.WithContext(ctx).
		Where("id = ? AND tree_id = ?", personID, treeID).
		First(&person).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("không tìm thấy người với id=%s", personID)
		}
		return nil, err
	}

	detail := &domain.PersonDetail{
		PersonSummary: toPersonSummary(person),
		BranchID:      person.BranchID,
		ChildType:     person.ChildType,
		LongevityInfo: person.LongevityInfo,
	}

	// Fetch Father
	if person.FatherID != nil {
		var father models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", *person.FatherID).First(&father).Error; err == nil {
			s := toPersonSummary(father)
			detail.Father = &s
		}
	}

	// Fetch Mother
	if person.MotherID != nil {
		var mother models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", *person.MotherID).First(&mother).Error; err == nil {
			s := toPersonSummary(mother)
			detail.Mother = &s
		}
	}

	// Fetch Spouses via marriage table
	detail.Spouses = r.getSpouses(ctx, treeID, personID, person.Gender)

	// Fetch Children
	detail.Children = r.getChildren(ctx, treeID, personID, person.Gender)

	// Fetch Siblings (share same father or same mother)
	detail.Siblings = r.getSiblings(ctx, treeID, personID, person.FatherID, person.MotherID)

	return detail, nil
}

// ==================================================
// GetLineageFromPerson
// ==================================================

func (r *personQueryRepository) GetLineageFromPerson(ctx context.Context, treeID, personID uuid.UUID, ancestorDepth, descendantDepth int) (*domain.LineageResult, error) {
	detail, err := r.GetPersonDetail(ctx, treeID, personID)
	if err != nil {
		return nil, err
	}

	result := &domain.LineageResult{Root: *detail}

	// Build upward ancestor tree
	if ancestorDepth > 0 {
		var root models.Person
		r.db.WithContext(ctx).Where("id = ? AND tree_id = ?", personID, treeID).First(&root)
		ancestorNode := r.buildAncestorTree(ctx, root, "", ancestorDepth)
		result.Ancestors = ancestorNode
	}

	// Build downward descendant tree
	if descendantDepth > 0 {
		var root models.Person
		r.db.WithContext(ctx).Where("id = ? AND tree_id = ?", personID, treeID).First(&root)
		descNode := r.buildDescendantTree(ctx, treeID, root, descendantDepth)
		result.Descendants = descNode
	}

	return result, nil
}

// buildAncestorTree recursively traverses upwards
func (r *personQueryRepository) buildAncestorTree(ctx context.Context, person models.Person, relation string, depth int) *domain.AncestorNode {
	node := &domain.AncestorNode{
		Person:   toPersonSummary(person),
		Relation: relation,
	}
	if depth == 0 {
		return node
	}

	if person.FatherID != nil {
		var father models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", *person.FatherID).First(&father).Error; err == nil {
			node.Parents = append(node.Parents, *r.buildAncestorTree(ctx, father, "father", depth-1))
		}
	}
	if person.MotherID != nil {
		var mother models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", *person.MotherID).First(&mother).Error; err == nil {
			node.Parents = append(node.Parents, *r.buildAncestorTree(ctx, mother, "mother", depth-1))
		}
	}
	return node
}

// buildDescendantTree recursively traverses downwards
func (r *personQueryRepository) buildDescendantTree(ctx context.Context, treeID uuid.UUID, person models.Person, depth int) *domain.DescendantNode {
	node := &domain.DescendantNode{
		Person: toPersonSummary(person),
	}

	// Get primary spouse (marriage_order = 1) for tree visualization
	spouses := r.getSpouses(ctx, treeID, person.ID, person.Gender)
	if len(spouses) > 0 {
		node.Spouse = &spouses[0].Person
	}

	if depth == 0 {
		return node
	}

	children := r.getChildren(ctx, treeID, person.ID, person.Gender)
	for _, child := range children {
		var childModel models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", child.ID).First(&childModel).Error; err == nil {
			node.Children = append(node.Children, *r.buildDescendantTree(ctx, treeID, childModel, depth-1))
		}
	}
	return node
}

// ==================================================
// GetRelationship - Calculate naming between two people
// ==================================================

func (r *personQueryRepository) GetRelationship(ctx context.Context, treeID, personAID, personBID uuid.UUID) (*domain.RelationshipPath, error) {
	var personA, personB models.Person
	if err := r.db.WithContext(ctx).Where("id = ? AND tree_id = ?", personAID, treeID).First(&personA).Error; err != nil {
		return nil, fmt.Errorf("không tìm thấy person_a: %w", err)
	}
	if err := r.db.WithContext(ctx).Where("id = ? AND tree_id = ?", personBID, treeID).First(&personB).Error; err != nil {
		return nil, fmt.Errorf("không tìm thấy person_b: %w", err)
	}

	// Load all persons in tree to perform Breadth-First Search (BFS)
	var allPersons []models.Person
	if err := r.db.WithContext(ctx).Where("tree_id = ?", treeID).Find(&allPersons).Error; err != nil {
		return nil, err
	}

	// Build adjacency map: personID -> list of (relatedID, relation)
	type edge struct {
		toID     uuid.UUID
		relation string // "father of", "mother of", "child of"
	}
	graph := make(map[uuid.UUID][]edge)

	for _, p := range allPersons {
		pID := p.ID
		if p.FatherID != nil {
			// p -> father of p
			graph[pID] = append(graph[pID], edge{*p.FatherID, "cha của"})
			// father -> child of father
			graph[*p.FatherID] = append(graph[*p.FatherID], edge{pID, "con của"})
		}
		if p.MotherID != nil {
			graph[pID] = append(graph[pID], edge{*p.MotherID, "mẹ của"})
			graph[*p.MotherID] = append(graph[*p.MotherID], edge{pID, "con của"})
		}
	}

	// Add marriage relationships to the graph
	var marriages []models.Marriage
	r.db.WithContext(ctx).Where("tree_id = ?", treeID).Find(&marriages)
	for _, m := range marriages {
		graph[m.HusbandID] = append(graph[m.HusbandID], edge{m.WifeID, "vợ của"})
		graph[m.WifeID] = append(graph[m.WifeID], edge{m.HusbandID, "chồng của"})
	}

	// BFS to find shortest path from A -> B
	type visit struct {
		id   uuid.UUID
		path []domain.PathStep
	}

	personMap := make(map[uuid.UUID]models.Person, len(allPersons))
	for _, p := range allPersons {
		personMap[p.ID] = p
	}

	visited := map[uuid.UUID]bool{personAID: true}
	queue := []visit{{
		id:   personAID,
		path: []domain.PathStep{{Person: toPersonSummary(personA), Relation: "bắt đầu"}},
	}}

	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]

		if curr.id == personBID {
			// Tìm thấy đường đi
			relDesc := inferRelationship(personA, personB, curr.path)
			return &domain.RelationshipPath{
				PersonA:      toPersonSummary(personA),
				PersonB:      toPersonSummary(personB),
				Relationship: relDesc,
				Path:         curr.path,
				Distance:     len(curr.path) - 1,
			}, nil
		}

		for _, e := range graph[curr.id] {
			if !visited[e.toID] {
				visited[e.toID] = true
				nextPerson := personMap[e.toID]
				newPath := make([]domain.PathStep, len(curr.path))
				copy(newPath, curr.path)
				newPath = append(newPath, domain.PathStep{
					Person:   toPersonSummary(nextPerson),
					Gender:   nextPerson.Gender,
					Relation: e.relation,
				})
				queue = append(queue, visit{id: e.toID, path: newPath})
			}
		}
	}

	return &domain.RelationshipPath{
		PersonA:      toPersonSummary(personA),
		PersonB:      toPersonSummary(personB),
		Relationship: "Không có quan hệ huyết thống trực tiếp",
		Path:         nil,
		Distance:     -1,
	}, nil
}

// ==================================================
// HELPER METHODS
// ==================================================

func (r *personQueryRepository) getSpouses(ctx context.Context, treeID, personID uuid.UUID, gender int8) []domain.SpouseInfo {
	var marriages []models.Marriage
	if gender == 1 { // Male -> find by husband_id
		r.db.WithContext(ctx).Where("tree_id = ? AND husband_id = ?", treeID, personID).
			Order("marriage_order ASC").Find(&marriages)
	} else { // Female -> find by wife_id
		r.db.WithContext(ctx).Where("tree_id = ? AND wife_id = ?", treeID, personID).
			Order("marriage_order ASC").Find(&marriages)
	}

	var spouses []domain.SpouseInfo
	for _, m := range marriages {
		spouseID := m.WifeID
		if gender == 0 {
			spouseID = m.HusbandID
		}
		var spouse models.Person
		if err := r.db.WithContext(ctx).Where("id = ?", spouseID).First(&spouse).Error; err == nil {
			spouses = append(spouses, domain.SpouseInfo{
				Person:        toPersonSummary(spouse),
				MarriageOrder: m.MarriageOrder,
				MarriageDate:  m.MarriageDate,
				DivorceDate:   m.DivorceDate,
				Note:          m.Note,
			})
		}
	}
	return spouses
}

func (r *personQueryRepository) getChildren(ctx context.Context, treeID, personID uuid.UUID, gender int8) []domain.PersonSummary {
	var children []models.Person
	field := "father_id"
	if gender == 0 {
		field = "mother_id"
	}
	r.db.WithContext(ctx).
		Where("tree_id = ? AND "+field+" = ?", treeID, personID).
		Order("birth_order ASC").
		Find(&children)

	summaries := make([]domain.PersonSummary, len(children))
	for i, c := range children {
		summaries[i] = toPersonSummary(c)
	}
	return summaries
}

func (r *personQueryRepository) getSiblings(ctx context.Context, treeID, personID uuid.UUID, fatherID, motherID *uuid.UUID) []domain.PersonSummary {
	if fatherID == nil && motherID == nil {
		return nil
	}

	query := r.db.WithContext(ctx).
		Where("tree_id = ? AND id != ?", treeID, personID)

	if fatherID != nil && motherID != nil {
		query = query.Where("father_id = ? OR mother_id = ?", *fatherID, *motherID)
	} else if fatherID != nil {
		query = query.Where("father_id = ?", *fatherID)
	} else {
		query = query.Where("mother_id = ?", *motherID)
	}

	var siblings []models.Person
	query.Order("birth_order ASC").Find(&siblings)

	summaries := make([]domain.PersonSummary, len(siblings))
	for i, s := range siblings {
		summaries[i] = toPersonSummary(s)
	}
	return summaries
}

// ==================================================
// inferRelationship - Logic to infer Vietnamese naming conventions
// ==================================================

func inferRelationship(personA, personB models.Person, path []domain.PathStep) string {
	distance := len(path) - 1
	genDiff := personB.GenerationNumber - personA.GenerationNumber

	if distance == 0 {
		return "Chính mình"
	}

	// Label for B based on gender
	labelB := "Anh/Em trai"
	if personB.Gender == 0 {
		labelB = "Chị/Em gái"
	}

	switch {
	// Spouses (Distance 1)
	case distance == 1 && genDiff == 0:
		lastRel := path[len(path)-1].Relation
		// Wife
		if lastRel == "vợ của" {
			return "Vợ"
		}
		// Husband
		if lastRel == "chồng của" {
			return "Chồng"
		}

	//Full SIBLINGS (Same parents, distance = 2, genDiff = 0)
	case genDiff == 0 && distance == 2:
		// Biological
		return fmt.Sprintf("%s ruột", labelB)

	// COUSINS (Distance = 4, same generation)
	case genDiff == 0 && distance == 4:
		// [A] -> [Parent A] -> [Grandparent] -> [Parent B] -> [B]
		parentA_Gender := path[1].Gender
		parentB_Gender := path[3].Gender

		if parentA_Gender == 1 && parentB_Gender == 1 {
			// Paternal - Children of uncles/aunts
			return fmt.Sprintf("%s họ nội (Con chú/bác)", labelB)
		}
		if parentA_Gender == 0 && parentB_Gender == 0 {
			// Maternal - Children of aunts
			return fmt.Sprintf("%s họ ngoại (Con dì)", labelB)
		}
		// Một bên nam, một bên nữ - Paternal/Maternal mixed
		return fmt.Sprintf("%s (Con cô cậu)", labelB)

	// UNCLES / AUNTS (Distance = 3, up 1 generation)
	case genDiff == -1 && distance == 3:
		// [A] -> [Parent A] -> [Grandparent - also parents of B] -> [B]
		parentA_Gender := path[1].Gender
		// Paternal side
		if parentA_Gender == 1 {
			if personB.Gender == 1 {
				return "Bác/Chú (Nội)" // Uncle (Paternal)
			}
			return "Cô (Nội)" // Aunt (Paternal)
		}
		// Maternal side
		if personB.Gender == 1 {
			return "Cậu (Ngoại)" // Uncle (Maternal)
		}
		return "Dì (Ngoại)" // Aunt (Maternal)

	// NEPHEW / NIECE (Distance = 3, down 1 generation)
	case genDiff == 1 && distance == 3:
		labelChau := "Cháu trai" // Nephew
		if personB.Gender == 0 {
			labelChau = "Cháu gái" // Niece
		}
		return fmt.Sprintf("%s (Gọi bạn là chú/bác/cậu/dì)", labelChau) // Calls you Uncle/Aunt

	// DIRECT LINEAGE (Father/Child/Grandparents)
	case genDiff == 1 && distance == 1:
		if personB.Gender == 1 {
			return "Con trai" // Son
		}
		return "Con gái" // Daughter

	case genDiff == -1 && distance == 1:
		if personB.Gender == 1 {
			return "Cha" // Father
		}
		return "Mẹ" // Mother

	case genDiff == -2 && distance == 2:
		if personB.Gender == 1 {
			return "Ông nội/ngoại" // Grandfather
		}
		return "Bà nội/ngoại" // Grandmother

	case genDiff == 2 && distance == 2:
		labelChau := "Cháu nội/ngoại" // Grandchild
		return labelChau

	default:
		if genDiff > 0 {
			return fmt.Sprintf("Hậu duệ đời thứ %d", personB.GenerationNumber) // Descendant (Generation %d)
		}
		if genDiff < 0 {
			return fmt.Sprintf("Tiền bối đời thứ %d", personB.GenerationNumber) // Ancestor (Generation %d)
		}
		return "Bà con xa" // Distant Relative
	}
	return "Bà con" // Relative
}

// ==================================================
// toPersonSummary mapper
// ==================================================

func toPersonSummary(p models.Person) domain.PersonSummary {
	// Logic: D3-hierarchy requires a single ParentID.
	// In Vietnamese genealogy, FatherID is prioritized as the primary axis.
	// var parentID *uuid.UUID
	// if p.FatherID != nil {
	// 	parentID = p.FatherID
	// } else if p.MotherID != nil {
	// 	parentID = p.MotherID
	// }

	return domain.PersonSummary{
		ID:               p.ID,
		FullName:         p.FullName,
		// ParentID:         parentID,
		FatherID:         p.FatherID,
		MotherID:         p.MotherID,
		NickName:         p.NickName,
		Gender:           p.Gender,
		GenerationNumber: p.GenerationNumber,
		BirthOrder:       p.BirthOrder,
		DateOfBirth:      p.DateOfBirth,
		DateOfDeath:      p.DateOfDeath,
		IsAlive:          p.IsAlive,
	}
}
