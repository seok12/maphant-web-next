import { statusResponse, dataResponse, GetAPI, PostAPI } from "./fetchAPI";

class CommentAPI {
  static commentPost(boardId: number, body: string, is_anonymous: number) {
    return PostAPI<statusResponse>(`/comment/insert`, {
      board_id: boardId,
      body: body,
      is_anonymous: is_anonymous,
    });
  }
}

export default CommentAPI;
