interface Soft {
    id: number;
    name: string;
    image: string | null;
    description: string;
    price: number;
    files?: { id: number; soft_id: number; file: string; size: string; platform: string; architecture: string }[];
}


const catalogFilter = (softList: Soft[], search: string, priceSort: "up" | "down") => {
    search = search.toLowerCase();
    let filtered: Soft[] = [...softList].filter((elem) =>
        elem.name.toLowerCase().includes(search) ||
        elem.description.toLowerCase().includes(search) ||
        elem.price.toString() === search ||
        (elem.files && elem.files.some((file) => file.platform.toLowerCase().includes(search)))
    );
    return filtered.sort((a, b) =>
        priceSort === "up" ? a.price - b.price : b.price - a.price
    )
};



export default catalogFilter;