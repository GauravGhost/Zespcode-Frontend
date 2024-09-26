export const difficultyDesign = (text: string | undefined) => {
    if (text == undefined) {
        return;
    }
    if (text == "easy") {
        return "text-green-500"
    } else if (text == "medium") {
        return "text-yellow-500"
    } else {
        return "text-red-500"
    }
}