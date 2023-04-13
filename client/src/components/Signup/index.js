import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import "./index.css";
function SignUp() {
  const [errorMsg, setErrorMsg] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      const id = uuidv4();
      values.id = id;
      setSubmitting(true);
      console.log(values);
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should be at least 3 characters long.")
        .required("Required*"),
      password: Yup.string()
        .min(8, "password should be at least 8 characters long.")
        .required("Required*"),
    }),
  });

  useEffect(() => {
    if (submitting) {
      axios
        .post("/createuser", formik.values)
        .then((response) => {
          setErrorMsg("");
          console.log(response);
          if (response.statusText === "OK") {
            navigate("/", { replace: true });
          }
          formik.resetForm();
        })
        .catch((e) => {
          console.log(e);
          const data = e.response.data;
          console.log(data);
          if (data.errno === 1062) {
            formik.resetForm();
            setErrorMsg(
              "Username already exists. Please try with a different username"
            );
          }
        });
    }
    setSubmitting(false);
  }, [submitting, formik.values, formik, navigate]);

  return (
    <div className="align-left">
      <div className="align-middle">
        <div className="s-align-name">
          <p className="s-welcome">Welcome back!!!</p>
          <h1 className="s-sign">Sign in</h1>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div>
                <p className="s-disc">Username*</p>
                <input
                  {...formik.getFieldProps("username")}
                  className="s-input2"
                  type="text"
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="s-error">{formik.errors.username}</div>
                ) : null}
              </div>
              <div>
                <p className="s-disc">password*</p>
                <input
                  {...formik.getFieldProps("password")}
                  className="s-input2"
                  type="password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="s-error">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>
            <div className="s-btn-align">
              <button type="submit" className="s-btn">
                SignUp
              </button>
            </div>
            {errorMsg && <p className="l-error">{errorMsg}</p>}
          </form>
          <p className="login-link">
            Have an account?{" "}
            <Link className="login-link-style" to="/login">
              Log in
            </Link>
          </p>
        </div>
        <div className="s-img">
          <img
            src="https://res.cloudinary.com/dhghcct1x/image/upload/v1681367762/Group_2014_rv9sjn.png"
            alt="imag"
          />
        </div>
      </div>
    </div>
  );
}
export default SignUp;
