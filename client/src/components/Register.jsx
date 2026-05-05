import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import authService from "../services/auth.service";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const initialValues = {
    username: "",
    email: "",
    password: "",
    roles: [],
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "El usuario debe tener entre 3 y 20 caracteres.",
        (val) => val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required("Este campo es obligatorio!"),
    email: Yup.string()
      .email("Este no es un correo válido.")
      .required("Este campo es obligatorio!"),
    password: Yup.string()
      .test(
        "len",
        "La contraseña debe tener entre 6 y 40 caracteres.",
        (val) => val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("Este campo es obligatorio!"),
  });

  const handleRegister = (formValue) => {
    const { username, email, password, roles } = formValue;
    setMessage("");
    setSuccessful(false);

    authService.register(username, email, password, roles).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <h3 className="text-center mb-4">Registro</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {!successful && (
                <div>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Usuario</label>
                    <Field name="username" type="text" className="form-control" />
                    <ErrorMessage name="username" component="div" className="text-danger small" />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-danger small" />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password">Contraseña</label>
                    <Field name="password" type="password" className="form-control" />
                    <ErrorMessage name="password" component="div" className="text-danger small" />
                  </div>

                  <div className="form-group mb-4">
                    <label>Roles</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="role-user"
                          value="user"
                          checked={values.roles.includes("user")}
                          onChange={(e) => {
                            const nextRoles = e.target.checked
                              ? [...values.roles, "user"]
                              : values.roles.filter((r) => r !== "user");
                            setFieldValue("roles", nextRoles);
                          }}
                        />
                        <label className="form-check-label" htmlFor="role-user">User</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="role-mod"
                          value="moderator"
                          checked={values.roles.includes("moderator")}
                          onChange={(e) => {
                            const nextRoles = e.target.checked
                              ? [...values.roles, "moderator"]
                              : values.roles.filter((r) => r !== "moderator");
                            setFieldValue("roles", nextRoles);
                          }}
                        />
                        <label className="form-check-label" htmlFor="role-mod">Mod</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="role-admin"
                          value="admin"
                          checked={values.roles.includes("admin")}
                          onChange={(e) => {
                            const nextRoles = e.target.checked
                              ? [...values.roles, "admin"]
                              : values.roles.filter((r) => r !== "admin");
                            setFieldValue("roles", nextRoles);
                          }}
                        />
                        <label className="form-check-label" htmlFor="role-admin">Admin</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-grid">
                    <button type="submit" className="btn btn-primary">Registrar</button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group mt-3">
                  <div
                    className={successful ? "alert alert-success" : "alert alert-danger"}
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
