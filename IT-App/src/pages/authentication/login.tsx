/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import axios from "axios";

import CryptoJS from "crypto-js";

const SignInPage: FC = function () {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Realizar una solicitud a la API para iniciar sesión
      const response = await axios.post(
        "https://bn.glassmountainbpo.com:8080/api/loginIT",
        {
          username,
          password,
        }
      );

      // Comprobar si la solicitud fue exitosa
      if (response.status == 200) {
        const responseData = response.data;

        if (responseData.message === "Ingreso de sesion correcta") {
          // Aquí puedes redirigir al usuario o realizar otras acciones después del inicio de sesión exitoso
          // Por ejemplo, redirigirlo a la página principal.
          const token = response.data.token;
          const badge = response.data.badge;
          const username = response.data.user;
          const picture = response.data.photo;
          const userLevel = response.data.level;
          const userCompany = response.data.company;
          // @ts-ignore
          localStorage.setItem('usernameSession', CryptoJS.AES.encrypt(username, "Tyrannosaurus"))
          // @ts-ignore
          localStorage.setItem('badgeSession', CryptoJS.AES.encrypt(badge, "Tyrannosaurus"));
          localStorage.setItem('userPicture', picture);
          // localStorage.setItem('badgeSession', response.data.badge)
          localStorage.setItem('token', token);
          // @ts-ignore
          localStorage.setItem('userLevel', CryptoJS.AES.encrypt(userLevel, "Tyrannosaurus"));
          // @ts-ignore
          localStorage.setItem('userCompany', CryptoJS.AES.encrypt(userCompany, "Tyrannosaurus"));
          window.location.href = "/"; // Cambia la URL de destino según tu aplicación
        } else {
          setError("Username or password incorrect.");
        }
      } else if (response.status === 400) {
        const responseData = response.data;

        if (responseData.error === "Nombre de usuario o contrasena incorrectos") {
          setError("Username or password incorrect.");
        } else {
          setError("Username or password incorrect.");
        }
      } else {
        setError("Username or password incorrect.");
      }
    } catch (error) {
      console.error("Error connecting to the API. Please try again later..", error);
      setError("Error connecting to the API. Please try again later.");
    }
  };
  return (


    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12" style={{ height: +950, zoom: 0.80 }}>
      <div className="my-6 flex items-center gap-x-1 lg:my-0">

        {/* <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span> */}
      </div>
      <Card
        horizontal
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <img
          alt="Glass Mountain BPO"
          src="/images/glass/logo.svg"
          className="h-24 dark:hidden"
        />
        <img
          alt="Glass Mountain BPO"
          src="/images/glass/logo-dark.svg"
          className="h-24 hidden dark:block"
        />
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Username</Label>
            <TextInput
              id="username"
              name="username"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <a
              href="#"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Lost Password?
            </a>
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
