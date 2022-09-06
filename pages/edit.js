import { MobileDatePicker } from "@mui/lab";
import { AppBar, Button, TextField, Toolbar } from "@mui/material";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { useTodosState } from "../hooks";
import Link from "../src/Link";
import { Common__notiSnackBarAtom } from "../states";
import { momentToFormat2 } from "../utils";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Edit() {
  const router = useRouter();

  const { id } = router.query;

  const [notiSnackBar, setNotiSnackBar] = useRecoilState(
    Common__notiSnackBarAtom
  );

  const { modifyTodo, findTodoById } = useTodosState();

  const todo = findTodoById(id);

  const [performDateInputValue, setPerformDateInputValue] = useState(
    todo.performDate
  );
  const [bodyInputValue, setBodyInputValue] = useState(todo.body);

  const onSubmit = () => {
    if (!performDateInputValue || performDateInputValue.trim().length == 0) {
      alert("언제 해야하는 일인지 날짜를 적어주세요.");
      return;
    }

    if (!bodyInputValue || bodyInputValue.trim().length == 0) {
      alert("할일 내용을 입력해주세요.");
      return;
    }

    modifyTodo(todo.id, performDateInputValue.trim(), bodyInputValue.trim());

    setNotiSnackBar({
      open: true,
      msg: `${todo.id}번 할일이 수정되었습니다.`,
      severity: "success",
    });

    router.replace("/");
  };

  return (
    <>
      <Head>
        <title>할일 수정 | TODO</title>
        <meta name='description' content='할일관리' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AppBar position='fixed'>
        <Toolbar>
          <div className='flex-1'></div>
          <Link href='/' noLinkStyle className='font-bold'>
            HAPPY NOTE
          </Link>
          <div className='flex-1 flex justify-end'></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div className='flex-1 flex flex-col p-10 gap-6'>
        <MobileDatePicker
          value={performDateInputValue}
          onChange={(newValue) =>
            setPerformDateInputValue(momentToFormat2(newValue))
          }
          label='언제 해야하나요?'
          inputFormat={"yyyy-MM-DD"}
          mask={"____-__-__"}
          renderInput={(params) => <TextField {...params} />}
          toolbarFormat='yyyy년 MM월'
          okText='확인'
          cancelText='취소'
        />

        <TextField
          className='flex-1 flex flex-col'
          InputProps={{ className: " flex-1 flex flex-col" }}
          inputProps={{ className: " flex-1" }}
          label='할일'
          placeholder='할일'
          multiline
          value={bodyInputValue}
          onChange={({ target: { value } }) => setBodyInputValue(value)}
        />
        <Button variant='contained' onClick={onSubmit}>
          <span>{todo.id}번 할일수정</span>
          <span>&nbsp;</span>
          <i className='fa-solid fa-marker'></i>
        </Button>
      </div>
    </>
  );
}
