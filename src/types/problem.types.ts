export interface ProblemData {
    _id: string;
    alternateId: number;
    title: string;
    titleSlug: string;
    description: string;
    hints: string[];
    difficulty: string;
    testCases: TestCase[];
    codeStubs: CodeStub[];
    tags: Tag[];
    isActive: boolean;
}

interface TestCase {
    input: string;
    _id: string;
}

export interface CodeStub {
    language: string;
    languageSlug: string;
    startSnippet: string;
    userSnippet: string;
    endSnippet: string;
    _id: string;
}

interface Tag {
    _id: string;
    name: string;
    slug: string;
}