import { CodeStub } from "../types/problem.types"

export const userSnippet = (codeStub: CodeStub[] | undefined, language: string): string => {
    if (!codeStub) {
        return "";
    }

    console.log(codeStub, language)
    const snippet = codeStub.find((stub) => stub.languageSlug == language);
    return snippet?.userSnippet || "";
}