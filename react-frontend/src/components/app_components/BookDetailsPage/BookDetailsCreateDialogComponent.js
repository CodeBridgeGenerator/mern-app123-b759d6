import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";


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

const BookDetailsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [authorName, setAuthorName] = useState([])

    useEffect(() => {
        let init  = {publicationDate:new Date()};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [authorName], setError);
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
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            bookName: _entity?.bookName,authorName: _entity?.authorName?._id,publicationDate: _entity?.publicationDate,price: _entity?.price,quantityInStock: _entity?.quantityInStock,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("bookDetails").create(_data);
        const eagerResult = await client
            .service("bookDetails")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "authorName",
                    service : "authorDetails",
                    select:["authorName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info BookDetails updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in BookDetails" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount authorDetails
                    client
                        .service("authorDetails")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleAuthorDetailsId } })
                        .then((res) => {
                            setAuthorName(res.data.map((e) => { return { name: e['authorName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "AuthorDetails", type: "error", message: error.message || "Failed get authorDetails" });
                        });
                }, []);

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

    const authorNameOptions = authorName.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create BookDetails" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="bookDetails-create-dialog-component">
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
                <label htmlFor="authorName">AuthorName:</label>
                <Dropdown id="authorName" value={_entity?.authorName?._id} optionLabel="name" optionValue="value" options={authorNameOptions} onChange={(e) => setValByKey("authorName", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["authorName"]) ? (
              <p className="m-0" key="error-authorName">
                {error["authorName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="publicationDate">PublicationDate:</label>
                <Calendar id="publicationDate" value={_entity?.publicationDate ? new Date(_entity?.publicationDate) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("publicationDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["publicationDate"]) ? (
              <p className="m-0" key="error-publicationDate">
                {error["publicationDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="price">Price:</label>
                <InputNumber id="price" className="w-full mb-3 p-inputtext-sm" value={_entity?.price} onChange={(e) => setValByKey("price", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["price"]) ? (
              <p className="m-0" key="error-price">
                {error["price"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantityInStock">QuantityInStock:</label>
                <InputNumber id="quantityInStock" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantityInStock} onChange={(e) => setValByKey("quantityInStock", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantityInStock"]) ? (
              <p className="m-0" key="error-quantityInStock">
                {error["quantityInStock"]}
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

export default connect(mapState, mapDispatch)(BookDetailsCreateDialogComponent);
