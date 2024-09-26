import { Link } from "react-router-dom";

type Tags = {
    name: string;
    slug: string
}

function CollapsableProblemsList({ problemName, tags, problemSlug }: Readonly<{ problemName: string, tags: Tags[], problemSlug: string }>) {
    return (
        <div className="collapse bg-stone-700 my-4 px-2">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-xl font-medium flex justify-between">
                <div>
                    {problemName}
                </div>
            </div>
            <div className="collapse-content">
                <div className="mb-4 mt-4">
                    <Link to={`/problem/${problemSlug}`} className="p-2 bg-primary rounded-lg">Solve Problem</Link>
                </div>
                {tags.map((tag: Tags) => <span className="mr-3 p-1 bg-black rounded-md text-sm text-gray-400" key={tag.slug}> {tag.name} </span>)}
            </div>
        </div>
    )
}

export default CollapsableProblemsList;