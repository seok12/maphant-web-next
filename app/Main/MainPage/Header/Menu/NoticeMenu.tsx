"use client";
import React from 'react'

import styles from './NoticeMenu.module.css';

function NotifiMenu() {
  return (
    <ul className={styles.noticeList}>
        <p className={styles.noticeTop}>알림</p>
        <li className={styles.notice}>~~~글에 댓글 달림</li>
        <li className={styles.notice}>댓글달림</li>
        <li className={styles.notice}>댓글달림</li>
        <li className={styles.notice}>댓글달림</li>
        <li className={styles.notice}>댓글달림</li>
        <li className={styles.notice}>댓글달림</li>
        <li className={styles.notice}>댓글달림</li>
    </ul>
  )
}

export default NotifiMenu
