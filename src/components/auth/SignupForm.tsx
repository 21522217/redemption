"use client";

import React from "react";
import useSignUp from "@/lib/firebase/signup";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const router = useRouter();
  const { signUp } = useSignUp();

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const { result, error } = await signUp({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
    });

    if (error) {
      return console.log(error);
    }

    // else successful
    console.log(result);
    return router.push("/admin");
  };
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign up</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="firstName">
            <p>First Name</p>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              required
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
            />
          </label>
          <label htmlFor="lastName">
            <p>Last Name</p>
            <input
              onChange={(e) => setLastName(e.target.value)}
              required
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
            />
          </label>
          <label htmlFor="username">
            <p>Username</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              required
              type="text"
              name="username"
              id="username"
              placeholder="Username"
            />
          </label>
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Page;
