import React, { useEffect } from "react";
import axios from "axios";
import {
  Title,
  Label,
  Button,
  Input,
  Select,
  PassphraseButton,
} from "../styles/components";
import Spinner from "../components/Spinner";
import Permits from "../components/Permits";
import { Top, Form, FormWrap, ErrorForm } from "../styles/form";
import Footer from "../components/Footer";
import I18n from "../i18n";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAsync } from "../hooks/useAsync";
import { UserSchema } from "../validationSchemas/index";

export default function NewUser(props: any) {
  const { register, handleSubmit, errors, setError, getValues } = useForm({
    validationSchema: UserSchema,
  });
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  const history = useHistory();

  async function onSubmit() {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "/api/user/",
        data: getValues(),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(({ data }) => resolve(data))
        .catch((e) => reject(e.response.data));
    });
  }

  useEffect(() => {
    if (error !== null) {
      for (const key in error) {
        setError(key.replace("body.", ""), "duplicate", error[key].message);
      }
    }
  }, [error]);

  useEffect(() => {
    if (value !== null) history.push("/users");
  }, [value]);

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input type="text" ref={register} name="newUserName"></Input>
          <ErrorForm>
            {errors.newUserName && errors.newUserName.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.mail" />
          </Label>
          <Input type="email" ref={register} name="newUserEmail"></Input>
          <ErrorForm>
            {errors.newUserEmail && errors.newUserEmail.message}
          </ErrorForm>
          <Label>PERMISOS</Label>
          <Select
            name="roles"
            multiple={true}
            style={{ height: "300px" }}
            ref={register}
          >
            <option value="project:create">Crear proyectos</option>
            <option value="project:readAll">Ver listado de proyectos</option>
            <option value="project:read">Ver proyectos individuales</option>
            <option value="project:changeState">
              Cambiar estado de proyectos
            </option>
            <option disabled value="">
              ---------------------
            </option>
            <option value="process:read">Ver procesos individuales</option>
            <option value="processes:read">
              Ver listado de procesos individuales
            </option>
            <option value="process:create">Crear procesos</option>
            <option value="process:assign">Asignar procesos</option>
            <option disabled value="">
              ---------------------
            </option>
            <option value="document:create">Crear un documento</option>
            <option value="document:read">Ver un documento</option>
            <option value="documents:read">Ver listado de documentos</option>
            <option disabled value="">
              ---------------------
            </option>
            <option value="admin:manageRoles">
              Gestionar roles de usuarios
            </option>
            <option value="admin:transfer">Transferir RBTC</option>
          </Select>
          <ErrorForm>{errors.roles && errors.roles.message}</ErrorForm>
          <Button disabled={pending} type="submit">
            {pending ? <Spinner color="white" size="sm" /> : "CREAR"}
          </Button>
        </Form>
      </FormWrap>

      <Footer />
    </>
  );
}
