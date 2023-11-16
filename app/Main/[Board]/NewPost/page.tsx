"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ErrorPage from "next/error";

import HashTagList from "./HashTagList";
import ImgList from "./ImgList";
import styles from "./newPost.module.css";
import { PostType } from "@/lib/type/postType";
import BoardAPI from "@/lib/api/BoardAPI";

type fileListType = {
  imgFile: File[];
  imgURL: string[];
};

function NewPost() {
  const router = useRouter();
  const [postData, setPostData] = useState<PostType>();
  const [hashTag, setHashTag] = useState<string[]>([]);
  const [fileList, setFileList] = useState<fileListType>({
    imgFile: [],
    imgURL: [],
  });

  const [changed, setChanged] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const boardURL = usePathname();
  const parts = boardURL.split("/");
  const boardLink = parts[parts.length - 2];
  let boardName: string = "";
  let boardType: number = 0;
  let boardText: string = "";

  if (boardLink === "Free") {
    boardName = "자유게시판";
    boardText = "자유롭게 글을 작성하세요";
    boardType = 1;
  } else if (boardLink === "Knowledge") {
    boardName = "지식게시판";
    boardText = "지식을 공유해보세요";
    boardType = 3;
  } else if (boardLink === "QnA") {
    boardName = "QnA";
    boardText = "궁금한 것을 물어보세요";
    boardType = 2;
  } else if (boardLink === "Promotion") {
    boardName = "홍보게시판";
    boardText = "여러가지를 홍보해보세요";
    boardType = 5;
  } else if (boardLink === "Career") {
    boardName = "취업/진로";
    boardText = "우리과의 취업 진로에 대해 글을 쓰세요";
    boardType = 4;
  } else if (boardLink === "Hobby") {
    boardName = "취미";
    boardText = "취미를 공유해보세요";
    boardType = 6;
  } else {
    return <ErrorPage statusCode={404} />;
  }

  const WritingEvent = () => {
    setChanged(true);
  };

  useEffect(() => {
    const unloadListner = (event: BeforeUnloadEvent) => {
      if (changed) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", unloadListner);

    return () => {
      window.removeEventListener("beforeunload", unloadListner);
    };
  }, [changed]);

  const PostEvent = () => {
    if (titleRef.current?.value && contentRef.current?.value) {
      console.log(hashTag)
      setPostData({
        typeId: boardType,
        title: titleRef.current.value,
        body: contentRef.current.value,
        isAnonymous: 0,
        isComplete: 0,
        isHide: 0,
        tagNames: hashTag ? hashTag : undefined,
      });
    } else {
      alert("제목과 내용을 모두 입력해 주세요.");
    }
  };
//
  useEffect(() => {
    if (postData) {
      const imgData = new FormData();
      fileList.imgFile.forEach((item) => {
        imgData.append("img", item);
      });
      console.log(imgData);
      BoardAPI.imgUpload(imgData).catch((err) => {
        console.log(err);
      });
      console.log(postData);
      BoardAPI.newPostArticle(postData)
        .then(() => {
          router.push(`/Main/${boardLink}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [postData]);

  return (
    <div className={styles.NewPostLayout}>
      <div className={styles.boardName}>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{boardName}</p>
        <p style={{ margin: 0 }}>{boardText}</p>
      </div>

      <div className={styles.newTitle}>
        <p style={{ margin: "1%" }}>- 제목</p>
        <input
          ref={titleRef}
          className={styles.inputTitle}
          type="text"
          placeholder="제목을 입력해주세요."
          onChange={WritingEvent}
        />
      </div>

      <div className={styles.newTag}>
        <p style={{ margin: "1%" }}>- 해시태그</p>
        <HashTagList hashTag={hashTag} setHashTag={setHashTag} />
      </div>

      <div className={styles.imgUpload}>
        <p style={{ margin: "1%" }}>- 사진 {"( 최대 5개 )"}</p>
        <ImgList fileList={fileList} setFileList={setFileList} />
      </div>

      <div className={styles.newContent}>
        <p style={{ margin: "1%" }}>- 내용</p>
        <textarea
          ref={contentRef}
          className={styles.inputContent}
          maxLength={1450}
          onChange={WritingEvent}
        ></textarea>
      </div>
      <div className={styles.newPostMenu}>
        <button className={styles.cancelBtn}>취소</button>
        <button className={styles.postBtn} onClick={() => PostEvent()}>
          등록
        </button>
      </div>
    </div>
  );
}

export default NewPost;
