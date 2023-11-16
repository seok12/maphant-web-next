"use client";

import React, { useEffect, useState } from "react";

import styles from "./Mypage.module.css";
import { useRouter } from "next/navigation";
import UserStorage from "@/lib/storage/UserStorage";
import UserAPI from "@/lib/api/UserAPI";
import { text } from "stream/consumers";

export default function Page() {
  const router = useRouter();
  //userdata받아오기
  const [userData, setUserData] = useState(UserStorage.getUserProfile()!!);
  //모달 기능 구현
  const [mydataopen, setMydataOpen] = useState(false);
  const [pwopen, setPwOpen] = useState(false);
  const [cgopen, setCgOpen] = useState(false);
  //닉네임 저장소
  const [newNickname, setNewNickname] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwcheck, setNewPwCheck] = useState("");
  //비밀번호 눈깔
  const [showNewPw, setShowNewPw] = useState(false);
  const toggleShowNewPw = () => {
    setShowNewPw(!showNewPw);
  };

  //체크 박스 선택 및 삭제
  const [selectcg, setSelcetCg] = useState<number[]>([]);

  //내 정보 수정 모달 열고 닫기
  const handlemydataopen = () => {
    setMydataOpen(true);
    setNewNickname(userData.nickname || "");
  };
  const handlemydataclose = () => {
    setMydataOpen(false);
  };
  //비밀번호 수정 모달 열고 닫기
  const handlepwopen = () => {
    setPwOpen(true);
  };
  const handlepwclose = () => {
    setPwOpen(false);
    setNewPw("");
    setNewPwCheck("");
  };
  // 전공 수정 모달 열고닫기
  const handlemycgopen = () => {
    setCgOpen(true);
  };
  const handlemycgclose = () => {
    setCgOpen(false);
    setmajor("");
    setdepart("");
  };

  //로그아웃 기능구현
  const loadUserData = async () => {
    try {
      const response = await UserAPI.getMyProfile();
      const loadedUserData = response.data;

      setUserData(loadedUserData); // 로드한 데이터로 상태 업데이트
      UserStorage.setUserProfile(loadedUserData); // 로컬 스토리지에 데이터 저장
    } catch (error) {
      console.error("Error loading user data:", error);
      // 오류 처리
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드 함수 호출
    loadUserData();
  }, []);

  // ...

  // 로그아웃 함수
  const Logout = () => {
    UserStorage.clear();
    router.push("/");
  };
  // 닉네임 변경
  const NicknameChange = (newNickname: string) => {
    setNewNickname(newNickname);
  };

  //비밀번호 입력 변경
  const PWChange = (newpw: string) => {
    setNewPw(newpw);
  };
  const PWCheckChange = (newpwcheck: string) => {
    setNewPwCheck(newpwcheck);
  };

  // 닉네임 수정
  const handleNicknameUpdate = () => {
    UserAPI.updateUserNickname(newNickname)
      .then(() => {
        alert("닉네임이 수정되었습니다.");
        setUserData((prevUserData) => ({
          ...prevUserData,
          nickname: newNickname,
        }));
        handlemydataclose();
      })

      .catch((err) => alert(err));
  };

  // 비밀번호 수정
  const handlePasswordUpdate = () => {
    UserAPI.updateUserPassWordModify(newPw, newPwcheck)
      .then((res) => {
        alert("비밀번호가 수정되었습니다.");
        handlepwclose();
      })
      .catch((err) => alert(err));
  };

  //회원 삭제
  const handleCheckboxChange = (index: number) => {
    if (selectcg.includes(index)) {
      setSelcetCg(selectcg.filter((item) => item !== index));
    } else {
      setSelcetCg([...selectcg, index]);
    }
  };

  const handleCategoryDelete = async () => {
    try {
      const categoriesToDelete = selectcg.map((index) => ({
        category: userData?.category[index].categoryName,
        major: userData?.category[index].majorName,
      }));

      if (categoriesToDelete.length > 0) {
        await Promise.all(
          categoriesToDelete.map((index) => {
            return UserAPI.DeleteCatagory(index.category, index.major);
          })
        );

        // 사용자 데이터 새로고침
        loadUserData();
        setSelcetCg([]);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("카테고리 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  //전공계열,학과
  const [major, setmajor] = useState("");
  const [depart, setdepart] = useState("");

  //전공계열,학과받기
  const [mlist, setmlist] = useState([]);
  const [dlist, setdlist] = useState([]);
  //전공계열 새로고침
  const onmajor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const majorvalue = e.target.value;
    setmajor(majorvalue);
  };

  const ondepart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const departvalue = e.target.value;
    setdepart(departvalue);
  };

  //전공계열 받기
  useEffect(() => {
    fetch("https://dev.api.tovelop.esm.kr/user/categorylist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setmlist(res.data)) // 데이터를 dlist 상태에 저장
      .catch((error) => {
        console.error("오류 데이터 전송", error);
      });
  }, []);
  // 학과 받기
  useEffect(() => {
    fetch("https://dev.api.tovelop.esm.kr/user/majorlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setdlist(res.data)) // 데이터를 dlist 상태에 저장
      .catch((error) => {
        console.error("오류 데이터 전송", error);
      });
  }, []);

  const addcg = async () => {
    if (!major || !depart) {
      alert("전공계열과 학과를 모두 선택하여 주세요");
    } else {
      try {
        // 학과 추가 API 요청 보내기
        await UserAPI.addCategory(userData.email, major, depart);

        // 사용자 데이터 새로고침
        loadUserData();
        setCgOpen(false);
        setmajor("");
        setdepart("");
      } catch (error) {
        console.error("Error adding category:", error);
        alert("카테고리 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  //회원탈퇴

  const [delstate, delsetState] = useState(false);
  const IDDelete = async () => {
    const delstate = confirm(
      `회원탈퇴하시겠습니끼? 
탈퇴하시게 되시면 이 아이디로 재가입 불가합니다 (중요)`
    );
    if (delstate) {
      alert(
        `회원탈퇴가 완료되었습니다.
해당 정보는 사용할수없으며 한달간 같은아이디로 회원가입불가합니다.`
      );
      await UserAPI.UserDelete();
      router.push("/");
    } else {
      alert("탈퇴가 취소되었습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.userInfo}>
        <h2 className={styles.sectionTitle}>내 정보</h2>
        <div className={styles.userDetails}>
          <section className={styles.profileSection}>
            <img
              src="user-profile.jpg"
              alt="User Profile"
              className={styles.profileImage}
            />
            <div className={styles.userInfomation}>
              {userData && (
                <>
                  <label>아이디:{userData.email}</label>
                  <label>
                    이름 : {userData.name} / 닉네임:{userData.nickname}
                  </label>
                  {userData.category.map((item, index) => (
                    <label key={index}>
                      학과: {item.majorName} / 전공: {item.categoryName}
                    </label>
                  ))}
                </>
              )}
            </div>
          </section>
          <label>소개글 :</label>
        </div>
      </section>
      <section className={styles.accountSettings}>
        <h2 className={styles.own}>계정</h2>
        <div className={styles.list}>
          <label onClick={handlemydataopen}>내 정보 수정</label>
          <br />
          <label onClick={handlepwopen}>비밀번호 수정</label>
          <br />
          <label onClick={handlemycgopen}>계열 학과 수정</label>
          <br />
          <label>소개 글 수정</label>
        </div>
      </section>
      <section className={styles.communitySettings}>
        <h2>커뮤니티 </h2>
        <div className={styles.list}>
          <label>내 게시판</label>
          <br />
          <label>즐겨찾기 한 게시판</label>
          <br />
          <label>작성한 댓글 목록</label>
        </div>
      </section>
      <section className={styles.etc}>
        <h2>기타</h2>
        <div className={styles.list}>
          <label onClick={IDDelete} font-color="red">
            회원 탈퇴
          </label>
          <br />
          <label onClick={Logout}>로그아웃</label>
        </div>
      </section>

      {mydataopen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>내 정보 수정</h2>
            <label>닉네임만 수정 가능합니다.</label>
            <br />
            <input
              className={styles.mydata}
              type="text"
              placeholder="이름"
              value={userData.name}
              readOnly
            />
            <input
              className={styles.mydata}
              type="text"
              placeholder="닉네임"
              value={newNickname}
              onChange={(e) => NicknameChange(e.target.value)}
            />
            <input
              className={styles.mydata}
              type="text"
              defaultValue={userData.studentNo}
              readOnly
            />
            <br />
            <button
              className={styles.mydatafix}
              type="submit"
              onClick={handleNicknameUpdate}
            >
              수정하기
            </button>
            <button className={styles.closebutton} onClick={handlemydataclose}>
              닫기
            </button>
          </div>
        </div>
      )}

      {pwopen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>비밀번호 수정</h2>
            <label>새 비밀번호와 비밀번호를 확인하여주세요</label>
            <br />
            <input
              className={styles.mydata}
              type={showNewPw ? "text" : "password"}
              placeholder="새 비밀번호"
              value={newPw}
              onChange={(e) => PWChange(e.target.value)}
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={toggleShowNewPw}
            >
              {showNewPw ? "🙈" : "👁️"}
            </button>

            <input
              className={styles.mydata}
              type="password"
              placeholder="비밀번호확인"
              value={newPwcheck}
              onChange={(e) => PWCheckChange(e.target.value)}
            />

            <br />
            <button
              className={styles.mydatafix}
              type="submit"
              onClick={handlePasswordUpdate}
            >
              수정하기
            </button>
            <button className={styles.closebutton} onClick={handlepwclose}>
              닫기
            </button>
          </div>
        </div>
      )}

      {cgopen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalcg}>
            <h2>개열/학과 수정</h2>
            <div className={styles.formBox}>
              <h3>지금 현재 나의 계열 학과</h3>
              <div className={styles.currentCategory}>
                {userData.category.map((item, index) => (
                  <p key={index}>
                    학과: {item.majorName} / 전공: {item.categoryName}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.formBox}>
              <h3>계열 학과 삭제</h3>
              {userData.category.map((item, index) => (
                <div className={styles.categoryItem} key={index}>
                  <input
                    type="checkbox"
                    className={styles.myCheckbox}
                    checked={selectcg.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label className="Dlist">
                    학과: {item.majorName} / 전공: {item.categoryName}
                  </label>
                </div>
              ))}
              <br />
              <button
                className={styles.closebutton}
                type="submit"
                onClick={handleCategoryDelete}
              >
                삭제하기
              </button>
            </div>

            <div className={styles.formBox}>
              <b className={styles.blist}>전공계열 및 학과 추가</b>
              <br />
              <br />
              <label className={styles.llist}>⊙전공계열</label>
              <br />
              <input
                className={styles.mydata3}
                type="Text"
                id="major"
                placeholder="전공계열을 선택하여주세요"
                list="majorlist"
                value={major}
                onChange={onmajor}
              />
              <datalist id="majorlist">
                {mlist.map((data, index) => (
                  <option key={index} value={data} />
                ))}
              </datalist>
              <br />
              <label className={styles.llist}>⊙학과</label>
              <br />
              <input
                className={styles.mydata3}
                type="text"
                id="departId"
                placeholder="학과를 입력해주세요."
                list="departlist"
                value={depart}
                onChange={ondepart}
              />
              <datalist id="departlist">
                {dlist.map((data, index) => (
                  <option key={index} value={data} />
                ))}
              </datalist>
              <button className={styles.closebutton} onClick={addcg}>
                추가하기
              </button>
            </div>

            <button className={styles.closebutton2} onClick={handlemycgclose}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
