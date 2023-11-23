import { useState, useEffect } from 'react';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Myconstants from './Myconstants';
import DatePicker from "react-datepicker";
import HorizontalTabs from './HorizontalTabs';
import moment from "moment";
import './EditForm.css';

const EditForm = ({ theuser }) => {
  const id = theuser.id;
  const [name, setname] = useState(theuser.name);
  const [mobile, setmobile] = useState(theuser.mobile);
  const [email, setemail] = useState(theuser.email);
  const [address, setaddress] = useState(theuser.address);
  const [dob, setDob] = useState(theuser.dob ? new Date(theuser.dob) : null);
  const [age, setAge] = useState(theuser.age);
  const [Maritalstatus, setMaritalstatus] = useState(theuser.Maritalstatus);
  const [BloodGroup, setBloodGroup] = useState(theuser.BloodGroup);
  const [Aadhaarno, setAadhaarno] = useState(theuser.Aadhaarno);
  const [PanNo, setPanNo] = useState(theuser.PanNo);
  const [proof, setProof] = useState(theuser.proof);
  const [bankaccnum, setBankAccNum] = useState(theuser.bankaccnum);
  const [bankName, setBankName] = useState(theuser.bankName);
  const [ifscCode, setIfscCode] = useState(theuser.ifscCode);
  const [educationData, setEducationData] = useState(theuser.educationData);
  const [dataArray, setDataArray] = useState(JSON.parse(educationData));
  const [certificates, setCertificate] = useState(theuser.certificates);
  const [companyEmail, setCompanyEmail] = useState(theuser.companyEmail);
  const [departments, setDepartment] = useState(theuser.department);
  const [RNRNO, setRNRNO] = useState(theuser.RNRNO);
  const [TNMCNO, setTNMCNO] = useState(theuser.TNMCNO);
  const [ValidlityDate, setValidlityDate] = useState(theuser.ValidlityDate ? new Date(theuser.ValidlityDate) : null); 
  const [designation, setdesignation] = useState(theuser.designation);
  const [dateofjoining, setdateofjoining] = useState(theuser.dateofjoining ? new Date(theuser.dateofjoining) : null);
  const [salary, setSalary] = useState(theuser.salary);
  const [PF, setPF] = useState(theuser.PF);
  const [ESINO, setESINO] = useState(theuser.ESINO);
  const [uploadFile,setuploadFile]=useState(theuser.uploadFile);
  const [medicalClaimPolicyNo, setMedicalClaimPolicyNo] = useState(theuser.medicalClaimPolicyNo);
  const [validityDateFrom, setValidityDateFrom] = useState(theuser.validityDateFrom ? new Date(theuser.validityDateFrom) : null);
  const [validityDateTo, setValidityDateTo] = useState(theuser.validityDateTo ? new Date(theuser.validityDateTo) : null);  
  const [reportedBy, setReportedBy] = useState(theuser.reportedBy);
  const [showTable, setShowTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [tab1Message, setTab1Message] = useState("");
  const [tab2Message, setTab2Message] = useState("");
  const [tab3Message, setTab3Message] = useState("");
  const { register, handleSubmit, formState: { errors }, resetField } = useForm();

  const handleDobChange = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setDob(date);
      setAge(getAge(date));
    } else {
      setDob(null);
      setAge('');
    }
  };

  const getAge = (dob) => {
    if (!dob || isNaN(dob.getTime())) {
      return '';
    }
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };


  // const handleInputChange = (index, fieldName, newValue) => {
  //   const updatedDataArray = [...dataArray];
  //   updatedDataArray[index][fieldName] = newValue;
  //   setDataArray(updatedDataArray);
  // };

  const handleOnChangeeducation = (e, index, field) => {
    const { value } = e.target;
    setDataArray((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };

  const handleRemoveRow = (index) => {
    // Remove the row from the dataArray using the index
    const updatedDataArray = [...dataArray];
    updatedDataArray.splice(index, 1);
    setDataArray(updatedDataArray);
  };

  const addNewRow = () => {
    const newRow = {
      degree: "",
      major: "",
      institution: "",
      marks: "",
      year: "",
    };
    setDataArray([...dataArray, newRow]);
  };
  
  function handleUpdateResponse(response, tab) {
    if (response.ok) {
      if (tab === "tab1") {
        setTab2Message("");
        setTab3Message("");
        setTab1Message("Updated Successfully");
      } else if (tab === "tab2") {
        setTab1Message("");
        setTab3Message("");
        setTab2Message("Updated Successfully");
      } else if (tab === "tab3") {
        setTab1Message("");
        setTab2Message("");
        setTab3Message("Updated Successfully");
      }
    } else {
      throw new Error("Failed to update employee data.");
    }
  }

  const [isProofSelected, setIsProofSelected] = useState(false);
  const [isCertificateSelected, setIsCertificateSelected] = useState(false);
  const [isFormSelected, setIsFormSelected] = useState(false);

  const handleProofSelect = (e) => {
    setProof(e.target.files[0]);
    setIsProofSelected(true);
  };

  const handleRemoveProof = () => {
    setProof(null);
    document.getElementById("selectProof").value = "";
    setIsProofSelected(false);
  };

  const handleCertificateSelect = (e) => {
    setCertificate(e.target.files[0]);
    setIsCertificateSelected(true);
  };

  const handleRemoveCertificate = () => {
    setCertificate(null);
    document.getElementById("selectCertificate").value = "";
    setIsCertificateSelected(false);
  };

  const handleFormSelect = (e) => {
    setuploadFile(e.target.files[0]);
    setIsFormSelected(true);
  };

  const handleRemoveForm =(e)=>{
    setuploadFile(null);
    document.getElementById("selectForm").value = "";
    setIsFormSelected(false)
  }

  const handleDateofjoiningChange = (date) => {
    setdateofjoining(date);
  };

  const handleValidityDateFromChange = (date) => {
    setValidityDateFrom(date);
  };

  const handleValidityDateToChange = (date) => {
    setValidityDateTo(date);
  };

  useEffect(() => {
    handleViewTable();
  }, []);

  const handleViewTable = () => {
    if (dataArray && dataArray.length > 0) {
      setShowTable(true);
      setShowMessage(false);
    } else {
      setShowTable(false);
      setShowMessage(true);
    }
  };
  const checkModifications = (tab) => {
    if (tab === "tab1") {
      if (
        name === theuser.name &&
        mobile === theuser.mobile &&
        email === theuser.email &&
        address === theuser.address &&
        dob === theuser.dob &&
        age === theuser.age &&
        Maritalstatus === theuser.Maritalstatus &&
        BloodGroup === theuser.BloodGroup &&
        Aadhaarno === theuser.Aadhaarno &&
        PanNo === theuser.PanNo &&
        proof === theuser.proof &&
        bankaccnum === theuser.bankaccnum &&
        bankName === theuser.bankName &&
        ifscCode === theuser.ifscCode 
      ) {
        return false
      }
    } else if (tab === "tab2") {
      if (
        JSON.stringify(dataArray) === theuser.educationData &&
        certificates === theuser.certificates
      ) {
        return false
      }
    } else if (tab === "tab3") {
      if (
        companyEmail === theuser.companyEmail &&
        departments === theuser.department &&
        RNRNO === theuser.RNRNO &&
        TNMCNO === theuser.TNMCNO &&
        ValidlityDate === theuser.ValidlityDate &&
        designation === theuser.designation &&
        dateofjoining === theuser.dateofjoining &&
        salary === theuser.salary &&
        PF === theuser.PF &&
        uploadFile === theuser.uploadFile &&
        ESINO === theuser.ESINO &&
        medicalClaimPolicyNo === theuser.medicalClaimPolicyNo &&
        validityDateFrom === theuser.validityDateFrom &&
        validityDateTo === theuser.validityDateTo &&
        reportedBy === theuser.reportedBy
      ) {
        return false
      }
    }
    return true;
  };

  const editemp = async (tab) => {
    try {
      const modified = checkModifications(tab);
      if (!modified) {
        if (tab === "tab1") {
          setTab1Message("No Modifications Made");
        } else if (tab === "tab2") {
          setTab2Message("No Modifications Made");
        } else if (tab === "tab3") {
          setTab2Message("No Modifications Made");
        }
        return;
      }
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("dob",dob);
      formData.append("age", age);
      formData.append("Maritalstatus", Maritalstatus);
      formData.append("BloodGroup", BloodGroup);
      formData.append("Aadhaarno", Aadhaarno);
      formData.append("PanNo", PanNo);
      formData.append("proof", proof);
      formData.append("bankName", bankName);
      formData.append("bankaccnum", bankaccnum);
      formData.append("ifscCode", ifscCode)
      formData.append("educationData", JSON.stringify(dataArray));
      formData.append("certificates", certificates);
      formData.append("companyEmail",companyEmail)
      formData.append("department", departments);
      formData.append("RNRNO", RNRNO);
      formData.append("TNMCNO", TNMCNO);
      formData.append("ValidlityDate", ValidlityDate);
      formData.append("designation", designation);
      formData.append("dateofjoining", dateofjoining);
      formData.append("medicalClaimPolicyNo",medicalClaimPolicyNo);
      formData.append("validityDateFrom", validityDateFrom);
      formData.append("validityDateTo", validityDateTo);
      formData.append("ESINO",ESINO);
      formData.append("PF",PF);
      formData.append("uploadFile",uploadFile);
      formData.append("salary", salary);
      formData.append("reportedBy",reportedBy);

      const res = await fetch(`http://127.0.0.1:7000/attendance/editemp`, {
        method: "PUT",
        body: formData,
      });
      handleUpdateResponse(res, tab);
      resetField();
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    {
      title: <div className="tab-title" id="personal-details" style={{ fontFamily: 'serif' }}>Personal Details</div>,
      content: (
        <div className="tab-content active" id='tab1' style={{marginLeft:"15%"}}>
          <div className="row">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Mobile
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={mobile}
                  {...register("mobile", {
                    pattern: /^[0-9]{10}$/
                  })}
                  onChange={(e) => setmobile(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {errors.mobile && <p>*Please enter a valid mobile number</p>}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Email
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={email}
                  {...register("email", {
                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                  })}
                  onChange={(e) => setemail(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {errors.email && <p>*Please check the Email</p>}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label><div className="form-control-label text-muted"
                  style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Address</div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={address}
                  {...register("address", {
                    pattern: /^[0-9/,a-zA-Z- 0-9.]*$/
                  })}
                  onChange={(e) => setaddress(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.address && <p>*Please check the address</p>}
              </div>
            </div>
          </div>
          <br />

          <div className="row">
          <div className="col-sm-3">
              <Form.Group>
                <div className="row">
                  <div className="col-sm-8">
                    <Form.Label>
                      <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px",whiteSpace:'nowrap' }}>Date Of Birth</div>
                    </Form.Label>
                    <input 
                      type="text"
                      className="mx-3 form-control my-custom-font"
                      readOnly
                      onClick={() => document.getElementById('dob-picker').click()}
                      value={dob ? dob.toLocaleDateString("en-GB") : ""}
                    />
                    <DatePicker
                      className="d-none"
                      id="dob-picker"
                      selected={dob}
                      onChange={handleDobChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  <div className="col-sm-4">
                    <Form.Label>
                      <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"}}>Age</div>
                    </Form.Label>
                    <input style={{ width: "100%"}}
                      type="text"
                      className="mx-2 form-control"
                      value={age}
                      readOnly
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
            <div className="col-sm-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Marital Status</div>
                </Form.Label>
                <div className="form-control-with-icon my-custom-font">
                  <Form.Select as="select" className="mx-3" value={Maritalstatus} onChange={e => setMaritalstatus(e.target.value)}>
                    <option className='my-dropdown' value="">Select</option>
                    {Myconstants.MaritalStatus.map(status => (
                      <option className='my-dropdown' key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </div>
            <div className="col-sm-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Blood Group</div>
                </Form.Label>
                <div className="form-control-with-icon my-custom-font">
                  <Form.Select as="select" className="mx-3" value={BloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                  <option value="" className='my-dropdown'>Select</option>
                    {Myconstants.BloodGroup.map(blood => (
                      <option className='my-dropdown' key={blood} value={blood}>{blood}</option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </div>
          </div>
          <br />

          <h4 style={{ fontFamily: 'serif',marginLeft:"30%" }}>KYC-Details</h4>
          <br/>
          <div className="row">
            <div className="col-sm-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Aadhaar Number
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={Aadhaarno}
                  {...register("Aadhaarno", {
                    pattern: /^(\d{4}\s?){2}\d{4}$/,
                  })}
                  onChange={(e) => setAadhaarno(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.Aadhaarno && <p>*Please check the Aadhaar No</p>}
              </div>
            </div>
            <div className="col-sm-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Pan Number
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={PanNo}
                  {...register("PanNo", {
                    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  })}
                  onChange={(e) => setPanNo(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.PanNo && <p>*Please check the PAN No</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group my-custom-font">
                <input id="selectProof" type="file" accept=".pdf" onChange={handleProofSelect} hidden />
                <label htmlFor="selectProof" className="bi bi-plus fa-md"
                  style={{ color: "rgb(103, 180, 204)", cursor: "pointer",marginLeft:"5%",marginTop:"8%",whiteSpace:"nowrap",fontFamily:"serif"}} >Choose PAN / Aadhaar
                  {proof && (
                    <span style={{ fontSize: "14px", marginLeft: "2%" }}>{proof.name}</span>
                  )}
                  </label>
                  
                {proof && (
                  <>
                    <button style={{ height: "0.5cm", width: "0.5cm", backgroundColor: "red", border: "none", color: "white", fontSize: "14px" , marginLeft: "2%"  }}
                      onClick={handleRemoveProof}>
                      <i className="fa fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Bank Account Number
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={bankaccnum}
                  {...register("bankaccnum", {
                    pattern: /^[0-9]{9,18}$/,
                  })}
                  onChange={(e) => setBankAccNum(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.bankaccnum && <p>*Please check the Account No</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Bank Name
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={bankName}
                  {...register("bankName", {
                    pattern: /^[a-zA-Z ]*$/,
                  })}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.bankName && <p>*Please Check the Bank Name</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    IFSC Code
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={ifscCode}
                  {...register("ifscCode", {
                    pattern: /^[a-zA-Z0-9]*$/,
                  })}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.ifscCode && <p>*Please check the IFSC Code</p>}
              </div>
            </div>
          </div>
          <br />

          <div style={{ display: "flex", float: "right" }}>
            <Button style={{ backgroundColor: "rgb(103, 180, 204)", border: "none", marginRight: "50px" }} onClick={() => editemp('tab1')} type="submit" block>
              Save
            </Button>
          </div>
          <div style={{ marginLeft: "35%", marginTop: "5%" }}>
            {tab1Message && (<div style={{ color: "rgb(103, 180, 204)", fontFamily: "serif", fontSize: "20px" }}>{tab1Message}</div>)}
          </div>
        </div>
      )
    },
    {
      title: <div className="tab-title" id="educational-details" style={{ fontFamily: 'serif' }}>Educational Details</div>,
      content: (
        <div className="tab-content" id='tab2'>
          {showMessage && (
            <p><b><center>You haven't added any education details yet!</center></b></p>
          )}
          {showTable && (
            <Form.Group>
              <table className="table-bordered" style={{borderColor:"#DEE2E6",marginLeft:"-10%"}}>
                    <thead>
                      <tr align="center">
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Sl.No</th>
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Degree</th>
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Major</th>
                        <th style={{ padding: "6px", fontSize:"16px", fontFamily:"serif" }}>Institution &amp; University</th>
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Marks</th>
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Year of Passing</th>
                        <th style={{ padding: "4px", fontSize:"16px", fontFamily:"serif" }}>Remove</th>
                      </tr>
                    </thead>
                <tbody>
                {dataArray.map((data, index) => (
                      <tr key={index}>
                      <td align="center">{index + 1}</td>
                      <td>
                        <input style={{ border:"none", padding:"6px", fontFamily:"serif", textAlign:"center" }} type="text" value={data.degree} onChange={(e) => { handleOnChangeeducation(e, index, "degree"); }} />
                      </td>
                        <td>
                        <input style={{ border:"none", padding:"6px", fontFamily:"serif", textAlign:"center"  }} type="text" value={data.major} onChange={(e) => { handleOnChangeeducation(e, index, "major");  }} />
                      </td>
                      <td>
                        <input style={{ border:"none", padding:"8px", fontFamily:"serif" }} type="text" value={data.institution} onChange={(e) => { handleOnChangeeducation(e, index, "institution"); }} />
                      </td>
                      <td>
                        <input style={{ border:"none", padding:"6px", fontFamily:"serif", textAlign:"center"  }} type="text" value={data.marks} onChange={(e) => { handleOnChangeeducation(e, index, "marks"); }} />
                      </td>
                      <td>
                        <input style={{ border:"none", padding:"6px", fontFamily:"serif", textAlign:"center"  }} type="text" value={data.year} onChange={(e) => { handleOnChangeeducation(e, index, "year"); }} />
                      </td>
                      <td align='center'>
                        <i className='fa fa-close' style={{ cursor: "pointer" }} onClick={() => handleRemoveRow(index)}></i>
                      </td>
                      </tr>
                      ))}
                </tbody>
              </table>
            </Form.Group>
          )}
         <br/>
          <div className="row">
          <div className="col-md-6">
              <div className="form-group my-custom-font">
                <input id="selectCertificate" type="file" accept=".pdf" onChange={handleCertificateSelect} hidden />
                <label htmlFor="selectCertificate" className="bi bi-plus fa-lg"
                  style={{ color: "rgb(103, 180, 204)", cursor: "pointer",whiteSpace:"nowrap",fontFamily:"serif",marginLeft:"-20%"}} >Upload Certificates
                  {certificates && (
                    <span style={{ fontSize: "14px", marginLeft: "2%" }}>{certificates.name}</span>
                  )}
                  </label>
                  
                {certificates && (
                  <>
                    <button style={{ height: "0.5cm", width: "0.5cm", backgroundColor: "red", border: "none", color: "white", fontSize: "14px" , marginLeft: "2%"  }}
                      onClick={handleRemoveCertificate}>
                      <i className="fa fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <i className="bi bi-plus fa-2x" style={{ backgroundColor:"rgb(103, 180, 204)" , color:"white",cursor:"pointer",marginLeft:"108%"}} title='Add New Row' onClick={addNewRow}></i>
            </div>
          </div>
          <br/>
          <div style={{ display: "flex", float: "right", marginRight:"-8%"}}>
            <Button style={{ backgroundColor: "rgb(103, 180, 204)", border: "none"}} onClick={() => editemp('tab2')} type="submit" block>
              Save
            </Button>
          </div>

          <div style={{ marginLeft: "40%", marginTop: "5%" }}>
            {tab2Message && (<div style={{ color: "rgb(103, 180, 204)", fontFamily: "serif", fontSize: "20px" }}>{tab2Message}</div>)}
          </div>
        </div>
      )
    },
      {
      title: <div className="tab-title" id="offer-information" style={{ fontFamily: 'serif' }}>Offer information</div>,
      content: (
        <div className="tab-content" id='tab3'>
           <div className="row">
           <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Company Email
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={companyEmail}
                  {...register("companyEmail", {
                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                  })}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {errors.companyEmail && <p>*Please check the Email</p>}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Department
                  </div>
                </Form.Label>
                    <div className='form-control-with-icon my-custom-font'>
                      <Form.Select className="mx-3" value={departments} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="" className='my-dropdown'>Select</option>
                        {Myconstants.departments.map(department => (
                          <option className='my-dropdown' key={department} value={department}>{department}</option>
                        ))}
                      </Form.Select>
                    </div>
              </Form.Group>
              <br/>
              {departments === "DOCTOR" && (
                <div className="row">
                  <div className="col">
                    <Form.Group>
                      <Form.Label>
                        <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>
                          TNMC NO
                        </div>
                      </Form.Label>
                      <Form.Control
                        className="mx-3 form-control my-custom-font"
                        type="text"
                        value={TNMCNO}
                        placeholder="TNMCNO"
                        {...register("TNMCNO", {
                          pattern: /^[a-zA-Z0-9]*$/,
                        })}
                        onChange={(e) => setTNMCNO(e.target.value)}
                      />
                    </Form.Group>
                    <div style={{ color: "red" }}>
                      {errors.TNMCNO && <p>*Please check the TNMCNO</p>}
                    </div>
                  </div>
                </div>
              )}

              {departments === "NURSE" && (
                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group>
                      <Form.Label>
                        <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>
                          RNR NO
                        </div>
                      </Form.Label>
                      <Form.Control
                        className="mx-3 form-control my-custom-font"
                        type="text"
                        value={RNRNO}
                        placeholder="RNRNO"
                        {...register("RNRNO", {
                          pattern: /^[0-9]*$/,
                        })}
                        onChange={(e) => setRNRNO(e.target.value)}
                      />
                    </Form.Group>
                    <div style={{ color: "red" }}>
                      {errors.RNRNO && <p>*Please check the RNRNO</p>}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group>
                      <Form.Label>
                        <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>
                          Validity Date
                        </div>
                      </Form.Label>
                      <DatePicker
                        className="mx-3 form-control my-custom-font"
                        selected={ValidlityDate}
                        onChange={(date) => setValidlityDate(date)}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        isClearable
                      />
                    </Form.Group>
                    <div style={{ color: "red" }}>
                      {errors.ValidlityDate && <p>*Please check the ValidityDate</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>     
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Designation
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={designation}
                  placeholder="Designation"
                  {...register("designation", {
                    pattern: /^[a-zA-Z ]*$/,
                  })}
                  onChange={(e) => setdesignation(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.designation && <p>*Please check the designation</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Date Of Joining
                  </div>
                </Form.Label>
                <DatePicker
                  className="mx-3 form-control my-custom-font"
                  selected={dateofjoining}
                  onChange={handleDateofjoiningChange}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable  
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.dateofjoining && <p>*Please check the dateofjoining</p>}
              </div>
            </div>
          </div>
        <br />

        <div className="row">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Medical Claim Policy Number
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={medicalClaimPolicyNo}
                  {...register("medicalClaimPolicyNo", {
                    pattern:/^[a-zA-Z0-9]*$/
                  })}
                  onChange={(e) => setMedicalClaimPolicyNo(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {errors.medicalClaimPolicyNo && <p>*Please enter a valid Medical Claim Policy Number</p>}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Validity Date From
                  </div>
                </Form.Label>
                <DatePicker
                  className="mx-3 form-control my-custom-font"
                  selected={validityDateFrom}
                  onChange={handleValidityDateFromChange}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable 
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.validityDateFrom && <p>*Please check the Validity Date From</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    Validity Date TO
                  </div>
                </Form.Label>
                <DatePicker
                  className="mx-3 form-control my-custom-font"
                  selected={validityDateTo}
                  onChange={handleValidityDateToChange}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable 
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.validityDateTo && <p>*Please check the Validity Date To</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label><div className="form-control-label text-muted"
                  style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>ESI Number</div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={ESINO}
                  {...register("ESINO", {
                    pattern: /^[a-zA-Z0-9]*$/
                  })}
                  onChange={(e) => setESINO(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.ESINO && <p>*Please check the ESI Number</p>}
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                    UAN/PF Number
                  </div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={PF}
                  {...register("PF", {
                    pattern: /^[a-zA-Z0-9]*$/
                  })}
                  onChange={(e) => setPF(e.target.value)}
                />
                <div style={{ color: "red" }}>
                  {errors.PF && <p>*Please check the PF Number</p>}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <div className="form-group my-custom-font">
                <input id="selectForm" type="file" accept=".pdf" onChange={handleFormSelect} hidden />
                <label htmlFor="selectForm" className="bi bi-plus fa-lg"
                  style={{ color: "rgb(103, 180, 204)", cursor: "pointer",marginLeft:"5%",marginTop:"16%",whiteSpace:"nowrap",fontFamily:"serif"}} >Form 11
                  {uploadFile && (
                    <span style={{ fontSize: "14px", marginLeft: "2%" }}>{uploadFile.name}</span>
                  )}
                  </label>
                  
                {uploadFile && (
                  <>
                    <button style={{ height: "0.5cm", width: "0.5cm", backgroundColor: "red", border: "none", color: "white", fontSize: "14px" , marginLeft: "2%"  }}
                      onClick={handleRemoveForm}>
                      <i className="fa fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label><div className="form-control-label text-muted"
                  style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Salary</div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={salary}
                  {...register("salary", {
                    pattern: /^[0-9]*$/
                  })}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.salary && <p>*Please check the Salary</p>}
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label><div className="form-control-label text-muted"
                  style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Reporting To</div>
                </Form.Label>
                <Form.Control
                  className="mx-3 form-control my-custom-font"
                  type="text"
                  value={reportedBy}
                  {...register("reportedBy", {
                    pattern: /^[a-zA-Z]*$/
                  })}
                  onChange={(e) => setReportedBy(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.reportedBy && <p>*Please check the Reporting To</p>}
              </div>
            </div> 
        </div>

        <div style={{ display: "flex", float: "right" }}>
            <Button style={{ backgroundColor: "rgb(103, 180, 204)", border: "none", marginRight: "10px",marginTop:"35%" }} onClick={() => editemp('tab3')} type="submit" block>
              Save
            </Button>
          </div>

          <div style={{ marginLeft: "40%", marginTop: "5%" }}>
            {tab3Message && (<div style={{ color: "rgb(103, 180, 204)", fontFamily: "serif", fontSize: "20px" }}>{tab3Message}</div>)}
          </div>
        </div>
      )
      },
  ];

  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
        <HorizontalTabs tabs={tabs}></HorizontalTabs>
      </Form>
    </div>
  );
}
export default EditForm;