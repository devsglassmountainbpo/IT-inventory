'use client';

import { Button, Dropdown, Label, ListGroup, Modal, TextInput } from 'flowbite-react';
import { HiCog, HiLogout, HiViewGrid, HiUser } from 'react-icons/hi';
import type { FC } from "react";
import { useEffect, useState } from "react"
import axios from 'axios';
import CryptoJS from "crypto-js";


export const UserToggle: FC = function () {
  const user3 = localStorage.getItem("badgeSession") || ""
  const user2 = (user3 ? CryptoJS.AES.decrypt(user3, "Tyrannosaurus") : "")
  const user = user2.toString(CryptoJS.enc.Utf8);
  const username3 = localStorage.getItem("usernameSession") || ""
  const username2 = (username3 ? CryptoJS.AES.decrypt(username3, "Tyrannosaurus") : "")
  const username = username2.toString(CryptoJS.enc.Utf8);
  const picture = localStorage.getItem("userPicture") || ""
  const [data, setData] = useState<any>('');

  function capitalize(str: any) {
    const lower = (str || '').toLowerCase()
    return (str || '').charAt(0).toUpperCase() + lower.slice(1)
  }

  function handleLogout() {
    // Borrar el token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('badgeSession');
    localStorage.removeItem('usernameSession');
    localStorage.removeItem('userPicture');
  }

  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/api/hired/' + user)
      .then(res => setData(res.data))
  }, [])

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <div className='realtive'
          style={{
            width: '45px',
            height: '45px',
            overflow: 'hidden',
            borderRadius: '50%',
          }}
        >
          <img
            className='realtive'
            src={'https://hr.glassmountainbpo.com/ap/employee/document/foto/' + (picture ? picture : 'user.png')}
            alt="user"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <span className="absolute h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 bg-green-400 right-[72px] bottom-[10px] opacity-75 animate-ping " />
          <span className="absolute h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 bg-green-400 right-[72px] bottom-[10px]" />
        </div>
      }
    >
      { user ? (
      <Dropdown.Header className="">
        <span className="block text-md font-extrabold mb-2">
          {
            capitalize(data.first_name) + " " + capitalize(data.first_last_name)
          }
        </span>
        <span className="block mt-1 truncate text-sm font-bold" style={{ display: 'flex', alignItems: 'center' }}>
          <HiUser className='text-green-400' /> &nbsp; {username}
        </span>
      </Dropdown.Header> ) :
      <Dropdown.Header className="">
      <span className="block mt-1 truncate text-sm font-bold" style={{ display: 'flex', alignItems: 'center' }}>
        <HiUser className='text-green-400' /> &nbsp; <a className="hover:text-green-400" href='/SignIn'>Sign In</a>
      </span>
    </Dropdown.Header>}
      <ListGroup.Item href="/" icon={HiViewGrid}>
        Dashboard
      </ListGroup.Item>
      <EditUserModal
        firstName={data.first_name}
        lastName={data.first_last_name}
        username={username}
        badge={user}
      />
      <Dropdown.Divider />
      <ListGroup.Item href="/SignIn" onClick={handleLogout} icon={HiLogout}>
        Log Out
      </ListGroup.Item>
    </Dropdown>
  )
};

const EditUserModal: FC<any> = function ({ firstName, lastName, username, badge }: any) {
  const [isOpen, setOpen] = useState(false);
  const id_rol = "";
  const created_user = badge;
  const [password, setPassword] = useState<any>('');
  const [password2, setPassword2] = useState<any>('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState('')

  // const handlePasswordChange = () => {
  //   setPasswordsMatch(password === password2);
  // }

  useEffect(() => {
    setPasswordsMatch(password === password2);
  },[password, password2])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handlePasswordChange();
    if (passwordsMatch === true) {
      try {
        const response = await axios.post('https://bn.glassmountainbpo.com:8080/edit/resetpwd', {
          badge, 
          username,
          password,
          id_rol,
          created_user,
        })
        if (response.status == 200) {
          const responseData = response.data;
          location.reload()

          if (responseData.message === "Usuario actualizado exitosamente") {
            setOpen(false);
          } else {
            console.log("Fatal Error");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      setPasswordMismatch("Passwords don't match!")
    }
  };


  return (
    <>
      <ListGroup.Item icon={HiCog} onClick={() => setOpen(true)}>Settings</ListGroup.Item>
      {passwordsMatch === true ? (
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Change Password</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="badge">Badge</Label>
                <div className="mt-1">
                  <TextInput
                    id="badge"
                    name="badge"
                    value={badge}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="mt-1">
                  <TextInput
                    id="username"
                    name="username"
                    value={username}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <div className="mt-1">
                  <TextInput
                    id="firstname"
                    name="firstname"
                    value={firstName}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <div className="mt-1">
                  <TextInput
                    id="lastname"
                    name="lastname"
                    value={lastName}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1">
                  <TextInput
                    id="password"
                    name="password"
                    type='password'
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password2">Password</Label>
                <div className="mt-1">
                  <TextInput
                    id="password2"
                    type='password'
                    name="password2"
                    onChange={e => {
                      setPassword2(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              onClick={(e) => { handleSubmit(e); }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Change Password</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="badge">Badge</Label>
                <div className="mt-1">
                  <TextInput
                    id="badge"
                    name="badge"
                    value={badge}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="mt-1">
                  <TextInput
                    id="username"
                    name="username"
                    value={username}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <div className="mt-1">
                  <TextInput
                    id="firstname"
                    name="firstname"
                    value={firstName}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <div className="mt-1">
                  <TextInput
                    id="lastname"
                    name="lastname"
                    value={lastName}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1">
                  <TextInput
                    id="password"
                    name="password"
                    type='password'
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password2">Password</Label>
                <div className="mt-1">
                  <TextInput
                    id="password2"
                    type='password'
                    name="password2"
                    onChange={e => {
                      setPassword2(e.target.value);
                    }}
                  />
                </div>
              </div>
                {passwordMismatch != "" ? <div><span className='text-red-500'>{passwordMismatch}</span></div> : <></>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              onClick={(e) => { handleSubmit(e); }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
