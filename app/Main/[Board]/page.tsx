"use client";
import ErrorPage from "next/error";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { MdArrowBack, MdArrowForward, MdSearch, MdSort } from "react-icons/md";

import { BoardListItem } from "@/lib/type/boardType";
import BoardAPI from "@/lib/api/BoardAPI";
import BoardPost from "./BoardPost/BoardPost";
import styles from "./Borad.module.css";

function Borad() {
  const router = useRouter();
  let boardName: string = "";
  let boardType: number = 0;
  let boardLink: string = "";
  const [boardPage, setBoardPage] = useState<number>(1);
  const [onSortMenu, setOnSortMenu] = useState<boolean>(false);
  const sortItems: string[] = ["최신순", "추천순"];
  const [sortNow, setSortNow] = useState<string>("최신순");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [articles, setArticles] = useState<BoardListItem>();
  let sort: number = 1;
  if (sortNow === "최신순") sort = 1;
  if (sortNow === "추천순") sort = 2;

  if (usePathname() === "/Main/Free") {
    boardName = "자유게시판";
    boardLink = "Free";
    boardType = 1;
  } else if (usePathname() === "/Main/Knowledge") {
    boardName = "지식게시판";
    boardLink = "Knowledge";
    boardType = 3;
  } else if (usePathname() === "/Main/QnA") {
    boardName = "QnA";
    boardLink = "QnA";
    boardType = 2;
  } else if (usePathname() === "/Main/Promotion") {
    boardName = "홍보게시판";
    boardLink = "Promotion";
    boardType = 5;
  } else if (usePathname() === "/Main/Career") {
    boardName = "취업/진로";
    boardLink = "Career";
    boardType = 4;
  } else if (usePathname() === "/Main/Hobby") {
    boardName = "취미";
    boardLink = "Hobby";
    boardType = 6;
  } else {
    return <ErrorPage statusCode={404} />;
  }

  const SortItem = () => {
    return (
      <ul className={styles.sortItem}>
        {sortItems.map((i) => {
          return (
            <button
              className={styles.sortMenu}
              style={sortNow === i ? { color: "gray" } : {}}
              onClick={() => {
                setSortNow(i);
                setOnSortMenu(false);
              }}
              key={i}
            >
              {i}
            </button>
          );
        })}
      </ul>
    );
  };

  const pageDownEvent = () => {
    if (boardPage > 1) setBoardPage(boardPage - 1);
  };
  const pageUpEvent = () => {
    setBoardPage(boardPage + 1);
  };

  const searchSubmitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputRef.current?.value) {
      router.push(
        `/Main/${boardLink}/Search?search=${searchInputRef.current.value}`
      );
    } else {
      alert("검색할 내용을 입력하세요");
    }
  };

  useEffect(() => {
    BoardAPI.listArticle(boardType, boardPage, 10, 1, sort)
      .then((res) => setArticles(res.data))
      .catch((error) => console.log("error", error));
  }, [boardPage, sort]);

  useEffect(() => {
    setBoardPage(1);
  }, [sortNow]);

  return (
    <div className={styles.boardLayout}>
      <div className={styles.molla}>?</div>

      <div className={styles.boardName}>{boardName}</div>

      <div className={styles.postMenu1}>

        <div className={styles.sortBox}>
          <button
            className={styles.sortBtn}
            onClick={() => setOnSortMenu(!onSortMenu)}
          >
            <MdSort size="1.375rem" />
            {sortNow}
          </button>
          {onSortMenu && <SortItem />}
        </div>
        <div className={styles.hashTags}>
          <p>#해시태그1</p>
          <p>#해시태그2</p>
          <p>#해시태그3</p>
          <p>#해시태그4</p>
        </div>
        <button
          className={styles.postBtn}
          onClick={() => {
            router.push(`/Main/${boardLink}/NewPost`);
          }}
        >
          글쓰기
          <CiEdit size="1.375rem" />
        </button>
      </div>

      <div className={styles.postMenu2}>
        <form className={styles.search} onSubmit={searchSubmitEvent}>
          <button type="submit" className={styles.searchIcon}>
            <MdSearch size="1.125rem" />
          </button>
          <input
            type="text"
            ref={searchInputRef}
            className={styles.searchInput}
            placeholder="검색"
          />
        </form>

        {articles && (
          <div className={styles.boardPage}>
            <p>
              {boardPage} / {articles!.pagination.totalPageCount}
            </p>
            <button
              className={`${
                articles?.pagination.existPrevPage
                  ? styles.pageBtnOn
                  : styles.pageBtnOff
              }`}
              onClick={pageDownEvent}
              disabled={!articles?.pagination.existPrevPage}
            >
              <MdArrowBack />
            </button>
            <button
              className={`${
                articles?.pagination.existNextPage
                  ? styles.pageBtnOn
                  : styles.pageBtnOff
              }`}
              disabled={!articles?.pagination.existNextPage}
              onClick={pageUpEvent}
            >
              <MdArrowForward />
            </button>
          </div>
        )}
      </div>

      <div className={styles.postList}>
        <div className={styles.BoardPostList}>
          {articles &&
            articles.list.map((content) => (
              <BoardPost
                content={content}
                boardLink={boardLink}
                key={content.boardId}
              />
            ))}
        </div>
      </div>
      {articles && (
        <div className={styles.postPage}>
          <button
            className={`${
              articles?.pagination.existPrevPage
                ? styles.pageBtnOn
                : styles.pageBtnOff
            }`}
            onClick={pageDownEvent}
            disabled={!articles?.pagination.existPrevPage}
          >
            <MdArrowBack />
            이전
          </button>
          {boardPage} / {articles!.pagination.totalPageCount}
          <button
            className={`${
              articles?.pagination.existNextPage
                ? styles.pageBtnOn
                : styles.pageBtnOff
            }`}
            disabled={!articles?.pagination.existNextPage}
            onClick={pageUpEvent}
          >
            다음
            <MdArrowForward />
          </button>
        </div>
      )}
    </div>
  );
}

export default Borad;
