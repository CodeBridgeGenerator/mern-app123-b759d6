import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const BookDetailsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [authorName, setAuthorName] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount authorDetails
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

    const onSave = async () => {
        let _data = {
            bookName: _entity?.bookName,
authorName: _entity?.authorName?._id,
publicationDate: _entity?.publicationDate,
price: _entity?.price,
quantityInStock: _entity?.quantityInStock,
        };

        setLoading(true);
        try {
            
        await client.service("bookDetails").patch(_entity._id, _data);
        const eagerResult = await client
            .service("bookDetails")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "authorName",
                    service : "authorDetails",
                    select:["authorName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info bookDetails updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
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

    const authorNameOptions = authorName.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit BookDetails" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="bookDetails-edit-dialog-component">
                <div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="bookName">BookName:</label>
            <InputText id="bookName" className="w-full mb-3 p-inputtext-sm" value={_entity?.bookName} onChange={(e) => setValByKey("bookName", e.target.value)}  required  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="authorName">AuthorName:</label>
            <Dropdown id="authorName" value={_entity?.authorName?._id} optionLabel="name" optionValue="value" options={authorNameOptions} onChange={(e) => setValByKey("authorName", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="publicationDate">PublicationDate:</label>
            <Calendar id="publicationDate" value={_entity?.publicationDate ? new Date(_entity?.publicationDate) : new Date()} onChange={ (e) => setValByKey("publicationDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="price">Price:</label>
            <InputNumber id="price" className="w-full mb-3 p-inputtext-sm" value={_entity?.price} onChange={(e) => setValByKey("price", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="quantityInStock">QuantityInStock:</label>
            <InputNumber id="quantityInStock" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantityInStock} onChange={(e) => setValByKey("quantityInStock", e.value)}  />
        </span>
        </div>
                <div className="col-12">&nbsp;</div>
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
