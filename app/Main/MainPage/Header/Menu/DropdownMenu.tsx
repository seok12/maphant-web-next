"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import UserStorage from "@/lib/storage/UserStorage";

import styles from "./DropdwonMenu.module.css";

const DropdownMenu = () => {
  const router = useRouter();

  const Logout = () => {
    UserStorage.clear();

    router.push("/");
  };
  return (
    <ul className={styles.menulist}>
      <Link href="/Main/MypagePW" className={styles.userInfo}>
        회원 정보
      </Link>
      <li className={styles.history}>활동 내역</li>
      <li className={styles.logout} onClick={Logout}>
        로그아웃
      </li>
    </ul>
  );
};

export default DropdownMenu;
