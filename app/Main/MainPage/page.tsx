"use client";
import React, { ReactElement } from "react";

import styles from "./MainApp.module.css";
import PostList from "./MainPost/PostList";

export default function MainApp(): ReactElement {
  return (
    <div className={styles.mainLayout}>
      <div className={styles.hot}>
        <div className={styles.hotPost}>
          <p>HOT 키워드</p>
          <p>#김치</p>
          <p>#찌개</p>
          <p>#제육</p>
          <p>#볶음</p>
        </div>
      </div>

      <div className={styles.box1}>
        <PostList boardName="자유" />

        <PostList boardName="지식" />

        <PostList boardName="QnA" />
      </div>

      <div className={styles.box2}>
        <PostList boardName="홍보" />

        <PostList boardName="취업/진로" />

        <PostList boardName="취미" />
      </div>
    </div>
  );
}
