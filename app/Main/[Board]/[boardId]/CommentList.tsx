import React, { useRef } from "react";

import styles from "./CommentList.module.css";
import CommentAPi from "@/lib/api/CommentAPI";

type PropsType = {
  boardId: number;
};

const CommentList = ({ boardId }: PropsType) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const resizeTextEvent = () => {
    textRef.current!.style.height = "auto";
    textRef.current!.style.height = textRef.current!.scrollHeight + "px";
  };

  const commentPostEvent = () => {
    if (textRef.current?.value) {
      CommentAPi.commentPost(boardId, textRef.current.value, 0)
        .then(() => {})
        .catch((err) => console.log(err));
    }
    else {
      alert("댓글 내용을 입력하세요")
    }
  };

  return (
    <div>
      <div className={styles.commentInput}>
        <textarea
          ref={textRef}
          className={styles.textBox}
          placeholder="댓글을 작성하세요"
          onChange={resizeTextEvent}
          rows={1}
        />
        <button className={styles.commentBtn} onClick={commentPostEvent}>
          댓글 쓰기
        </button>
      </div>
      <div>

      </div>
    </div>
  );
};

export default CommentList;
