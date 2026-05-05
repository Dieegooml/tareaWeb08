import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import authService from "../services/auth.service";
import { setAccessToken } from "../services/api";

const Login = ({ setUser }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Este campo es obligatorio!"),
    password: Yup.string().required("Este campo es obligatorio!"),
  });

  const handleLogin = (formValue) => {
    const { username, password } = formValue;
    setMessage("");

    authService.login(username, password).then(
      (data) => {
        setAccessToken(data.accessToken);
        setUser(data);
        navigate("/");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="col-md-12 login-form">
      <div className="card card-container p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group mb-3">
              <label htmlFor="username">Usuario</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger small" />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Contraseña</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger small" />
            </div>

            <div className="form-group d-grid">
              <button type="submit" className="btn btn-primary">
                Ingresar
              </button>
            </div>

            {message && (
              <div className="form-group mt-3">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
