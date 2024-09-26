import useApi from "../../hooks/useApi";
import { GET_ALL_PROBLEM_LIST } from "../../api/index.ts"
import CollapsableProblemsList from "./CollapsableProblemsList.tsx";

type ProblemListResponse = {
    _id: string;
    problemId: number;
    tags: Tags[];
    title: string;
    titleSlug: string

}

type Tags = {
    name: string;
    slug: string
}

function ProblemList() {
    const problemListsResponse = useApi<ProblemListResponse[]>(GET_ALL_PROBLEM_LIST());
    const problemLists = problemListsResponse.data;

    return (
        <div className="flex justify-center items-center w-[100vw]">
            <div className="topic-list flex flex-col w-[60%]">
                {problemLists?.map((problem: ProblemListResponse) => <CollapsableProblemsList problemName={problem.title} key={problem.problemId} problemSlug={problem.titleSlug} tags={problem.tags} />)}
            </div>
        </div>
    )
}

export default ProblemList;