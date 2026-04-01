"use client";

import React, { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
} from '@xyflow/react';
import * as d3 from 'd3-hierarchy';
import '@xyflow/react/dist/style.css';

import { MemberNode } from "@/components/family/member-node";
import { FamilyMember, FamilyNode, FamilyEdge } from '@/types';

const nodeTypes = { familyMember: MemberNode };

const FamilyMemberData = [
    {
        "id": "019d2848-5239-7c18-9c16-5c1651d42f60",
        "full_name": "Lê Thị Hoa",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
                "full_name": "Nguyễn Văn Đức",
                "gender": 1
            }
        ],
        "nick_name": "Cụ Hoa",
        "gender": 0,
        "generation_number": 1,
        "birth_order": 1,
        "date_of_birth": "1855-07-20T00:00:00Z",
        "date_of_death": "1925-04-10T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "full_name": "Nguyễn Văn Đức",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5239-7c18-9c16-5c1651d42f60",
                "full_name": "Lê Thị Hoa",
                "gender": 0
            }
        ],
        "nick_name": "Cụ Đức",
        "gender": 1,
        "generation_number": 1,
        "birth_order": 1,
        "date_of_birth": "1850-03-15T00:00:00Z",
        "date_of_death": "1920-11-02T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-523d-7141-8530-8530ba59d806",
        "full_name": "Phạm Thị Lan",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-523b-7336-8307-0307990fb436",
                "full_name": "Nguyễn Văn Tài",
                "gender": 1
            }
        ],
        "nick_name": "Bà Lan",
        "gender": 0,
        "generation_number": 2,
        "birth_order": 1,
        "date_of_birth": "1882-05-03T00:00:00Z",
        "date_of_death": "1955-12-01T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-523b-7336-8307-0307990fb436",
        "full_name": "Nguyễn Văn Tài",
        "parent_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "father_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "mother_id": "019d2848-5239-7c18-9c16-5c1651d42f60",
        "spouses": [
            {
                "id": "019d2848-523d-7141-8530-8530ba59d806",
                "full_name": "Phạm Thị Lan",
                "gender": 0
            }
        ],
        "nick_name": "Ông Tài",
        "gender": 1,
        "generation_number": 2,
        "birth_order": 1,
        "date_of_birth": "1878-01-10T00:00:00Z",
        "date_of_death": "1950-08-20T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5242-7638-8ccb-4ccb980dddae",
        "full_name": "Vũ Thị Mai",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5240-7b6f-a440-a4409ffd9e08",
                "full_name": "Nguyễn Văn Lộc",
                "gender": 1
            }
        ],
        "nick_name": "Bà Mai",
        "gender": 0,
        "generation_number": 2,
        "birth_order": 1,
        "date_of_birth": "1885-02-28T00:00:00Z",
        "date_of_death": "1965-07-15T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5240-7b6f-a440-a4409ffd9e08",
        "full_name": "Nguyễn Văn Lộc",
        "parent_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "father_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "mother_id": "019d2848-5239-7c18-9c16-5c1651d42f60",
        "spouses": [
            {
                "id": "019d2848-5242-7638-8ccb-4ccb980dddae",
                "full_name": "Vũ Thị Mai",
                "gender": 0
            }
        ],
        "nick_name": "Chú Lộc",
        "gender": 1,
        "generation_number": 2,
        "birth_order": 2,
        "date_of_birth": "1882-09-14T00:00:00Z",
        "date_of_death": "1960-03-22T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5244-7fc6-91af-d1afd454e8a5",
        "full_name": "Nguyễn Văn Bình",
        "parent_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "father_id": "019d2848-5237-7110-9fd0-9fd04dc460b9",
        "mother_id": "019d2848-5239-7c18-9c16-5c1651d42f60",
        "nick_name": "Chú Bình",
        "gender": 1,
        "generation_number": 2,
        "birth_order": 3,
        "date_of_birth": "1888-11-05T00:00:00Z",
        "date_of_death": "1975-01-30T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-524f-7474-a74d-e74dd6282223",
        "full_name": "Nguyễn Văn Dũng",
        "parent_id": "019d2848-5240-7b6f-a440-a4409ffd9e08",
        "father_id": "019d2848-5240-7b6f-a440-a4409ffd9e08",
        "mother_id": "019d2848-5242-7638-8ccb-4ccb980dddae",
        "spouses": [
            {
                "id": "019d2848-5251-72d0-8800-c800ce6a3752",
                "full_name": "Trần Thị Thu",
                "gender": 0
            }
        ],
        "nick_name": "Chú Dũng",
        "gender": 1,
        "generation_number": 3,
        "birth_order": 1,
        "date_of_birth": "1915-06-18T00:00:00Z",
        "date_of_death": "1999-04-05T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "full_name": "Nguyễn Văn Hùng",
        "parent_id": "019d2848-523b-7336-8307-0307990fb436",
        "father_id": "019d2848-523b-7336-8307-0307990fb436",
        "mother_id": "019d2848-523d-7141-8530-8530ba59d806",
        "spouses": [
            {
                "id": "019d2848-5248-7ab3-979d-579ddd52e7fc",
                "full_name": "Đinh Thị Ngọc",
                "gender": 0
            }
        ],
        "nick_name": "Bác Hùng",
        "gender": 1,
        "generation_number": 3,
        "birth_order": 1,
        "date_of_birth": "1910-04-12T00:00:00Z",
        "date_of_death": "1985-06-30T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5248-7ab3-979d-579ddd52e7fc",
        "full_name": "Đinh Thị Ngọc",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5246-7342-9b30-5b305755e6e8",
                "full_name": "Nguyễn Văn Hùng",
                "gender": 1
            }
        ],
        "nick_name": "Bác Ngọc",
        "gender": 0,
        "generation_number": 3,
        "birth_order": 1,
        "date_of_birth": "1915-08-25T00:00:00Z",
        "date_of_death": "1990-02-14T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-524d-7823-8b8d-8b8d7c502881",
        "full_name": "Hoàng Thị Bé",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-524a-7265-abc0-2bc0681f8c81",
                "full_name": "Nguyễn Văn Thịnh",
                "gender": 1
            }
        ],
        "nick_name": "Thím Bé",
        "gender": 0,
        "generation_number": 3,
        "birth_order": 1,
        "date_of_birth": "1918-03-07T00:00:00Z",
        "date_of_death": "1995-11-20T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5251-72d0-8800-c800ce6a3752",
        "full_name": "Trần Thị Thu",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-524f-7474-a74d-e74dd6282223",
                "full_name": "Nguyễn Văn Dũng",
                "gender": 1
            }
        ],
        "nick_name": "Thím Thu",
        "gender": 0,
        "generation_number": 3,
        "birth_order": 1,
        "date_of_birth": "1920-10-30T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-524a-7265-abc0-2bc0681f8c81",
        "full_name": "Nguyễn Văn Thịnh",
        "parent_id": "019d2848-523b-7336-8307-0307990fb436",
        "father_id": "019d2848-523b-7336-8307-0307990fb436",
        "mother_id": "019d2848-523d-7141-8530-8530ba59d806",
        "spouses": [
            {
                "id": "019d2848-524d-7823-8b8d-8b8d7c502881",
                "full_name": "Hoàng Thị Bé",
                "gender": 0
            }
        ],
        "nick_name": "Chú Thịnh",
        "gender": 1,
        "generation_number": 3,
        "birth_order": 2,
        "date_of_birth": "1913-12-01T00:00:00Z",
        "date_of_death": "1980-09-10T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5253-7650-8af7-8af750a721b1",
        "full_name": "Nguyễn Văn Khoa",
        "parent_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "father_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "mother_id": "019d2848-5248-7ab3-979d-579ddd52e7fc",
        "spouses": [
            {
                "id": "019d2848-5262-7cf9-abf2-6bf218ef00fe",
                "full_name": "Lê Thị Bích",
                "gender": 0
            }
        ],
        "gender": 1,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1940-02-20T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5264-7415-9d9a-9d9aa732b32a",
        "full_name": "Cao Văn Toàn",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5255-7936-b638-763826b32ec9",
                "full_name": "Nguyễn Thị Loan",
                "gender": 0
            }
        ],
        "gender": 1,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1940-01-25T00:00:00Z",
        "date_of_death": "2005-07-18T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5267-7456-800d-000d9067c2e8",
        "full_name": "Bùi Thị Hương",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5260-7464-9a73-9a73f504bc1b",
                "full_name": "Nguyễn Văn Minh",
                "gender": 1
            }
        ],
        "gender": 0,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1955-03-12T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-525a-7d86-8fc8-8fc892fbf075",
        "full_name": "Nguyễn Văn Hải",
        "parent_id": "019d2848-524a-7265-abc0-2bc0681f8c81",
        "father_id": "019d2848-524a-7265-abc0-2bc0681f8c81",
        "mother_id": "019d2848-524d-7823-8b8d-8b8d7c502881",
        "gender": 1,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1942-05-08T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5262-7cf9-abf2-6bf218ef00fe",
        "full_name": "Lê Thị Bích",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5253-7650-8af7-8af750a721b1",
                "full_name": "Nguyễn Văn Khoa",
                "gender": 1
            }
        ],
        "gender": 0,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1942-06-15T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-525e-78ed-91c1-91c1f32597f8",
        "full_name": "Nguyễn Thị Phương",
        "parent_id": "019d2848-524f-7474-a74d-e74dd6282223",
        "father_id": "019d2848-524f-7474-a74d-e74dd6282223",
        "mother_id": "019d2848-5251-72d0-8800-c800ce6a3752",
        "gender": 0,
        "generation_number": 4,
        "birth_order": 1,
        "date_of_birth": "1948-04-22T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-525c-753d-9fe4-9fe43ad42575",
        "full_name": "Nguyễn Thị Hằng",
        "parent_id": "019d2848-524a-7265-abc0-2bc0681f8c81",
        "father_id": "019d2848-524a-7265-abc0-2bc0681f8c81",
        "mother_id": "019d2848-524d-7823-8b8d-8b8d7c502881",
        "gender": 0,
        "generation_number": 4,
        "birth_order": 2,
        "date_of_birth": "1945-12-19T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5255-7936-b638-763826b32ec9",
        "full_name": "Nguyễn Thị Loan",
        "parent_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "father_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "mother_id": "019d2848-5248-7ab3-979d-579ddd52e7fc",
        "spouses": [
            {
                "id": "019d2848-5264-7415-9d9a-9d9aa732b32a",
                "full_name": "Cao Văn Toàn",
                "gender": 1
            }
        ],
        "gender": 0,
        "generation_number": 4,
        "birth_order": 2,
        "date_of_birth": "1943-07-11T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5260-7464-9a73-9a73f504bc1b",
        "full_name": "Nguyễn Văn Minh",
        "parent_id": "019d2848-524f-7474-a74d-e74dd6282223",
        "father_id": "019d2848-524f-7474-a74d-e74dd6282223",
        "mother_id": "019d2848-5251-72d0-8800-c800ce6a3752",
        "spouses": [
            {
                "id": "019d2848-5267-7456-800d-000d9067c2e8",
                "full_name": "Bùi Thị Hương",
                "gender": 0
            }
        ],
        "gender": 1,
        "generation_number": 4,
        "birth_order": 2,
        "date_of_birth": "1952-08-30T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5257-7d1c-b8ec-f8ec90ca5ad1",
        "full_name": "Nguyễn Văn Sơn",
        "parent_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "father_id": "019d2848-5246-7342-9b30-5b305755e6e8",
        "mother_id": "019d2848-5248-7ab3-979d-579ddd52e7fc",
        "gender": 1,
        "generation_number": 4,
        "birth_order": 3,
        "date_of_birth": "1947-09-02T00:00:00Z",
        "date_of_death": "2010-03-15T00:00:00Z",
        "is_alive": false
    },
    {
        "id": "019d2848-5276-7f61-8d4a-cd4ab295bc90",
        "full_name": "Trần Thị Hà",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
                "full_name": "Nguyễn Văn Tuấn",
                "gender": 1
            }
        ],
        "gender": 0,
        "generation_number": 5,
        "birth_order": 1,
        "date_of_birth": "1970-04-18T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
        "full_name": "Nguyễn Văn Tuấn",
        "parent_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "father_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "mother_id": "019d2848-5262-7cf9-abf2-6bf218ef00fe",
        "spouses": [
            {
                "id": "019d2848-5276-7f61-8d4a-cd4ab295bc90",
                "full_name": "Trần Thị Hà",
                "gender": 0
            }
        ],
        "nick_name": "Anh Tuấn",
        "gender": 1,
        "generation_number": 5,
        "birth_order": 1,
        "date_of_birth": "1968-11-15T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5278-71e3-907a-507a7569af45",
        "full_name": "Lý Thị Thảo",
        "parent_id": null,
        "spouses": [
            {
                "id": "019d2848-5272-7853-bf7c-7f7ce99a0399",
                "full_name": "Nguyễn Văn Phúc",
                "gender": 1
            }
        ],
        "nick_name": "Thảo",
        "gender": 0,
        "generation_number": 5,
        "birth_order": 1,
        "date_of_birth": "1982-02-14T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-526f-76bc-9613-d6135a6b7a1a",
        "full_name": "Cao Thị Thùy",
        "parent_id": "019d2848-5264-7415-9d9a-9d9aa732b32a",
        "father_id": "019d2848-5264-7415-9d9a-9d9aa732b32a",
        "mother_id": "019d2848-5255-7936-b638-763826b32ec9",
        "gender": 0,
        "generation_number": 5,
        "birth_order": 1,
        "date_of_birth": "1966-09-30T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5272-7853-bf7c-7f7ce99a0399",
        "full_name": "Nguyễn Văn Phúc",
        "parent_id": "019d2848-5260-7464-9a73-9a73f504bc1b",
        "father_id": "019d2848-5260-7464-9a73-9a73f504bc1b",
        "mother_id": "019d2848-5267-7456-800d-000d9067c2e8",
        "spouses": [
            {
                "id": "019d2848-5278-71e3-907a-507a7569af45",
                "full_name": "Lý Thị Thảo",
                "gender": 0
            }
        ],
        "nick_name": "Phúc",
        "gender": 1,
        "generation_number": 5,
        "birth_order": 1,
        "date_of_birth": "1980-12-01T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-5274-758d-bb75-bb75e6238053",
        "full_name": "Nguyễn Thị Quỳnh",
        "parent_id": "019d2848-5260-7464-9a73-9a73f504bc1b",
        "father_id": "019d2848-5260-7464-9a73-9a73f504bc1b",
        "mother_id": "019d2848-5267-7456-800d-000d9067c2e8",
        "nick_name": "Quỳnh",
        "gender": 0,
        "generation_number": 5,
        "birth_order": 2,
        "date_of_birth": "1983-05-17T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-526b-72e5-842d-042d9de5b969",
        "full_name": "Nguyễn Thị Linh",
        "parent_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "father_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "mother_id": "019d2848-5262-7cf9-abf2-6bf218ef00fe",
        "nick_name": "Chị Linh",
        "gender": 0,
        "generation_number": 5,
        "birth_order": 2,
        "date_of_birth": "1971-03-08T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-526d-7446-9578-d578e5a15fd0",
        "full_name": "Nguyễn Văn Long",
        "parent_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "father_id": "019d2848-5253-7650-8af7-8af750a721b1",
        "mother_id": "019d2848-5262-7cf9-abf2-6bf218ef00fe",
        "nick_name": "Anh Long",
        "gender": 1,
        "generation_number": 5,
        "birth_order": 3,
        "date_of_birth": "1975-07-22T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-527a-748b-838b-838b37af4fe6",
        "full_name": "Nguyễn Văn An",
        "parent_id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
        "father_id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
        "mother_id": "019d2848-5276-7f61-8d4a-cd4ab295bc90",
        "nick_name": "An",
        "gender": 1,
        "generation_number": 6,
        "birth_order": 1,
        "date_of_birth": "1998-06-10T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-527f-7549-9165-91657d4725eb",
        "full_name": "Nguyễn Gia Bảo",
        "parent_id": "019d2848-5272-7853-bf7c-7f7ce99a0399",
        "father_id": "019d2848-5272-7853-bf7c-7f7ce99a0399",
        "mother_id": "019d2848-5278-71e3-907a-507a7569af45",
        "nick_name": "Bảo",
        "gender": 1,
        "generation_number": 6,
        "birth_order": 1,
        "date_of_birth": "2008-03-20T00:00:00Z",
        "is_alive": true
    },
    {
        "id": "019d2848-527c-737a-9769-17696d7c29e3",
        "full_name": "Nguyễn Thị Mai Anh",
        "parent_id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
        "father_id": "019d2848-5269-7b1c-9fdc-dfdc58df375c",
        "mother_id": "019d2848-5276-7f61-8d4a-cd4ab295bc90",
        "nick_name": "Mai Anh",
        "gender": 0,
        "generation_number": 6,
        "birth_order": 2,
        "date_of_birth": "2002-09-25T00:00:00Z",
        "is_alive": true
    }
]

export default function FamilyTreePage() {
    const rawData: FamilyMember[] = FamilyMemberData;

    const { initialNodes, initialEdges } = useMemo(() => {
        if (!rawData.length) return { initialNodes: [], initialEdges: [] };

        try {
            const realRoots = rawData.filter(m => !m.parent_id);

            const VIRTUAL_ROOT_ID = 'virtual-root';
            const dataWithVirtualRoot: any[] = [
                { id: VIRTUAL_ROOT_ID, full_name: 'Virtual Root', parent_id: null },
                ...rawData.map(m => ({
                    ...m,
                    // Nếu là root thật, gán cha nó là virtual root
                    parent_id: m.parent_id || VIRTUAL_ROOT_ID
                }))
            ];

            const stratify = d3.stratify<any>()
                .id(d => d.id)
                .parentId(d => d.parent_id);

            const hierarchy = stratify(dataWithVirtualRoot);
            const root = d3.tree<any>().nodeSize([250, 200])(hierarchy);

            const nodes: FamilyNode[] = root.descendants()
                .filter(d => {
                    // Chỉ hiện node nếu là Virtual Root (để tính toán) 
                    // Hoặc là người có dòng máu chính (không phải chỉ là vợ/chồng đi kèm)
                    if (d.data.id === VIRTUAL_ROOT_ID) return false;

                    // Logic lọc: Nếu là nữ và không có parent_id trong DB, thường là vợ được add vào
                    const isSpouseOnly = !rawData.find(m => m.id === d.data.id)?.parent_id && d.data.gender === 0;
                    return !isSpouseOnly;
                })
                .map(d => ({
                    id: d.data.id,
                    type: 'familyMember' as const, // Fix type literal
                    position: { x: d.x, y: d.y },
                    data: d.data,
                }));

            const edges: FamilyEdge[] = root.links()
                .filter(l => l.source.data.id !== VIRTUAL_ROOT_ID)
                .map(l => ({
                    id: `e${l.source.data.id}-${l.target.data.id}`,
                    source: l.source.data.id,
                    target: l.target.data.id,
                    type: ConnectionLineType.SmoothStep,
                    animated: true,
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                }));

            return { initialNodes: nodes, initialEdges: edges };
        } catch (error) {
            console.error("D3 Stratify Error: Hệ thống phân cấp dữ liệu bị lỗi (vòng lặp hoặc thiếu node cha).", error);
            return { initialNodes: [], initialEdges: [] };
        }
    }, [rawData]);

    const [nodes, , onNodesChange] = useNodesState<FamilyNode>(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState<FamilyEdge>(initialEdges);

    return (
        <div className="h-[100%] w-full bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                onlyRenderVisibleElements
                aria-label="Family Tree Graph"
            >
                <Background color="#cbd5e1" gap={20} />
                <Controls />
                <MiniMap
                    nodeColor={n => (n.data?.gender === 1 ? '#3b82f6' : '#ec4899')}
                    zoomable
                    pannable
                />
            </ReactFlow>
        </div>
    );
}