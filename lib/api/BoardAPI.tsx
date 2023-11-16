import { statusResponse } from "@/app/fetchAPI";
import { BoardListItem } from "../type/boardType";
import { PostType, readPostType } from "../type/postType";
import { collectType } from "../type/collectType";
import { dataResponse, GetAPI, PostAPI } from "./fetchAPI";
import { DeleteAPI } from "./fetchAPI";
import { PutAPI } from "./fetchAPI";
class BoardAPI {
  static listArticle(
    boardTypeId: number,
    page: number = 1,
    recordSize: number,
    pageSize: number = 10,
    sortCriterionId: number
  ) {
    return GetAPI<dataResponse<BoardListItem>>(`/board/`, {
      boardTypeId,
      page,
      recordSize,
      pageSize,
      sortCriterionId,
    });
  }

  static newPostArticle(postData: PostType) {
    return PostAPI<statusResponse>(`/board/create/`, postData);
  }

  static imgUpload(imgFile: FormData) {
    return PostAPI<statusResponse>(`/image`, imgFile);
  }

  static readPost(boardId: number) {
    return GetAPI<dataResponse<readPostType>>(`/board/${boardId}/`);
  }

  static postLike(boardId: number) {
    return PostAPI<statusResponse>(`/board/like/${boardId}/`);
  }
  static reportPost(boardId: number) {
    return PostAPI<statusResponse>(
      `/board/report/?boardId=${boardId}&reportId=1`
    );
  }
  static PostDelete(boardId: number) {
    return DeleteAPI<statusResponse>(`/board/${boardId}/`);
  }

  static PostCollecton(collectData: collectType) {
    return PutAPI<statusResponse>(`/board/update/`, collectData);
  }
}

export default BoardAPI;
