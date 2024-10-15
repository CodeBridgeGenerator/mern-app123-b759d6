import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const ReviewDetailsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        let init  = {createdAt:new Date(),isApproved: false};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.bookName)) {
                error["bookName"] = `BookName field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.userName)) {
                error["userName"] = `UserName field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.reviewText)) {
                error["reviewText"] = `ReviewText field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            bookName: _entity?.bookName,userName: _entity?.userName,rating: _entity?.rating,reviewText: _entity?.reviewText,createdAt: _entity?.createdAt,isApproved: _entity?.isApproved || false,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("reviewDetails").create(_data);
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info ReviewDetails created successfully" });
        props.onCreateResult(result);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in ReviewDetails" });
        }
        setLoading(false);
    };

    

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    

    return (
        <Dialog header="Create ReviewDetails" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="reviewDetails-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="bookName">BookName:</label>
                <InputText id="bookName" className="w-full mb-3 p-inputtext-sm" value={_entity?.bookName} onChange={(e) => setValByKey("bookName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["bookName"]) ? (
              <p className="m-0" key="error-bookName">
                {error["bookName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userName">UserName:</label>
                <InputText id="userName" className="w-full mb-3 p-inputtext-sm" value={_entity?.userName} onChange={(e) => setValByKey("userName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userName"]) ? (
              <p className="m-0" key="error-userName">
                {error["userName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="rating">Rating:</label>
                <InputNumber id="rating" min={1} max={5} style={{width:"20rem"}} value={_entity?.rating} onChange={ (e) => setValByKey("rating", e.value)} cancel={false}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["rating"]) ? (
              <p className="m-0" key="error-rating">
                {error["rating"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="reviewText">ReviewText:</label>
                <InputTextarea id="reviewText" rows={5} cols={30} value={_entity?.reviewText} onChange={ (e) => setValByKey("reviewText", e.target.value)} autoResize  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["reviewText"]) ? (
              <p className="m-0" key="error-reviewText">
                {error["reviewText"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="createdAt">CreatedAt:</label>
                <Calendar id="createdAt" value={_entity?.createdAt ? new Date(_entity?.createdAt) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("createdAt", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["createdAt"]) ? (
              <p className="m-0" key="error-createdAt">
                {error["createdAt"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field flex">
            <span className="align-items-center">
                <label htmlFor="isApproved">IsApproved:</label>
                <Checkbox id="isApproved" className="ml-3" checked={_entity?.isApproved} onChange={ (e) => setValByKey("isApproved", e.checked)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["isApproved"]) ? (
              <p className="m-0" key="error-isApproved">
                {error["isApproved"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ReviewDetailsCreateDialogComponent);
