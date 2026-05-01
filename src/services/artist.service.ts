import { Artist } from "../types/artist.types"

export const getArtists = async (): Promise<Artist[]> => {

    return [
        {
            id: "1",
            name: "Diljit",
            imageUrl: "https://i.pravatar.cc/200?img=10"
        },
        {
            id: "2",
            name: "Karan Aujla",
            imageUrl: "https://i.pravatar.cc/200?img=11"
        },
        {
            id: "3",
            name: "Kr$na",
            imageUrl: "https://i.pravatar.cc/200?img=12"
        },
        {
            id: "4",
            name: "Lana Del Rey",
            imageUrl: "https://i.pravatar.cc/200?img=13"
        }
    ]
}