"use client";
import React, { useEffect, useState } from "react";

import BoardAPI from "@/lib/api/BoardAPI";

import Post from "./Post";
import Styles from "./PostList.module.css";
import { BoardListItem } from "@/lib/type/boardType";

type BoardName = {
  boardName: string;
};

function PostList({ boardName }: BoardName) {
  const [articles, setArticles] = useState<BoardListItem>();
  let boardType: number = 0;

  if (boardName === "자유") boardType = 1;
  if (boardName === "QnA") boardType = 2;
  if (boardName === "지식") boardType = 3;
  if (boardName === "취업/진로") boardType = 4;
  if (boardName === "홍보") boardType = 5;
  if (boardName === "취미") boardType = 6;

  useEffect(() => {
    BoardAPI.listArticle(boardType, 1, 5, 5, 1)
      .then((data) => setArticles(data.data))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {}, []);

  console.log(boardName + "--" + boardType + "--");
  console.log(articles);

  return (
    <div className={Styles.postList}>
      <div className={Styles.boardTitle}>{boardName}</div>
      {articles && articles.list.map((content) => (
        <Post content={content} key={content.boardId} />
      ))}
    </div>
  );
}

export default PostList;
