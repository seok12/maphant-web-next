import { BoardListItem } from "../type/boardType";
import { dataResponse, GetAPI } from "./fetchAPI";


class BoardAPI {
	static listArticle(
        content: string,
        boardTypeId:number,
		tagName:string,
		page:number,
		recordSize:number
	) {
		return GetAPI<dataResponse<BoardListItem>>(`/board/search/`, {
            content,
            boardTypeId,
			tagName,
			page,
			recordSize
		});
	}
}

export default BoardAPI;