import { useState, useEffect} from 'react';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Table from 'react-bootstrap/Table';
import DatePicker from "react-datepicker";
import VerticalTabs from "./VerticalTabs";

const EditForm = ({ theuser }) => {
  const id = theuser.id;
  const [name, setname] = useState(theuser.name);
  const [mobile, setmobile] = useState(theuser.mobile);
  const [address, setaddress] = useState(theuser.address);
  const [Aadhaarno, setAadhaarno] = useState(theuser.Aadhaarno);
  const [bankaccnum, setBankAccNum] = useState(theuser.bankaccnum);
  const [designation, setdesignation] = useState(theuser.designation);
  const [email, setemail] = useState(theuser.email);
  const [PanNo, setPanNo] = useState(theuser.PanNo);
  const [RNRNO, setRNRNO] = useState(theuser.RNRNO);
  const [TNMCNO, setTNMCNO] = useState(theuser.TNMCNO);
  const [ValidityDate, setValidityDate] = useState(theuser.ValidlityDate);
  const [Maritalstatus, setMaritalstatus] = useState(theuser.Maritalstatus);
  const [BloodGroup, setBloodGroup] = useState(theuser.BloodGroup);
  const [educationData, setEducationData] = useState(theuser.educationData);
  const [departments, setDepartment] = useState(theuser.department);
  const [dateofjoining, setdateofjoining] = useState(theuser.dateofjoining);
  const [showTable, setShowTable] = useState(false);
  const [dataArray, setDataArray] = useState(JSON.parse(educationData));
  const [showMessage, setShowMessage] = useState(false);
  const { register,handleSubmit,formState: { errors },resetField } = useForm();
  const [proof, setProof] = useState(theuser.proof);
  const [certificates, setCertificate] = useState(theuser.certificates);
  const [dob, setDob] = useState(theuser.dob ? new Date(theuser.dob) : null);
  const [age, setAge] = useState(theuser.age);
  const [tab1Message, setTab1Message] = useState("");
  const [tab2Message, setTab2Message] = useState("");
  
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
  
  const handleInputChange = (e, rowIndex, fieldName) => {
    const updatedDataArray = [...dataArray];
    updatedDataArray[rowIndex][fieldName] = e.target.value;
    setDataArray(updatedDataArray);
  };

  function handleUpdateResponse(response,tab) {
    if (response.ok) {
      if (tab === "tab1") {
        setTab1Message("Updated Successfully");
        setTab2Message(""); // Clear the message for tab 2
      } else if (tab === "tab2") {
        setTab1Message(""); // Clear the message for tab 1
        setTab2Message("Updated Successfully");
      }
    } else {
      throw new Error("Failed to update employee data.");
    }
  }
  
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isCertificateSelected, setIsCertificateSelected] = useState(false);
  const handleFileSelect = (e) => {
    setProof(e.target.files[0]);
    setIsFileSelected(true);
  };

  const handleRemoveFile = () => {
    setProof(null);
    document.getElementById("selectFile").value = "";
    setIsFileSelected(false);
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
        address === theuser.address &&
        designation === theuser.designation &&
        departments === theuser.department &&
        dateofjoining === theuser.dateofjoining &&
        email === theuser.email &&
        Aadhaarno === theuser.Aadhaarno &&
        bankaccnum === theuser.bankaccnum &&
        PanNo === theuser.PanNo &&
        RNRNO === theuser.RNRNO &&
        TNMCNO === theuser.TNMCNO &&
        ValidityDate === theuser.ValidlityDate &&
        age === theuser.age &&
        Maritalstatus === theuser.Maritalstatus &&
        BloodGroup === theuser.BloodGroup &&
        proof === theuser.proof &&
        certificates === theuser.certificates
      ) {
        return false
      }
    } else if (tab === "tab2") {
      if (JSON.stringify(dataArray) === theuser.educationData) {
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
      }
      return;
    }
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("address", address);
      formData.append("designation", designation);
      formData.append("department", departments);
      formData.append("dateofjoining",dateofjoining)
      formData.append("email", email);
      formData.append("Aadhaarno", Aadhaarno);
      formData.append("bankaccnum", bankaccnum);
      formData.append("PanNo", PanNo);
      formData.append("RNRNO", RNRNO);
      formData.append("TNMCNO", TNMCNO);
      formData.append("ValidlityDate", ValidityDate);
      formData.append("age",age);
      formData.append("Maritalstatus", Maritalstatus);
      formData.append("BloodGroup", BloodGroup);
      formData.append("educationData", JSON.stringify(dataArray));
      formData.append("proof", proof);
      formData.append("certificates", certificates);
      
      const res = await fetch(`https://smrftadmin.onrender.com/attendance/editemp`, {
        method: "PUT",
        body: formData,
      });
      handleUpdateResponse(res,tab);
      resetField();
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    {
      title: <div className="tab-title" id="personal-details">Personal Details</div> ,
      content: (
        <div class="tab-content active" id='tab1'>
        <Form.Group>
        <div className="row">
          <div className="col">
            <Form.Label>
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                Mobile
              </div>
            </Form.Label>
            <Form.Control
              style={{ borderRadius: "0.5cm",width:"60%"}}
              className="mx-3 form-control"
              type="text"
              value={mobile}
              placeholder="Mobile"
              {...register("mobile", {
                pattern: /^[0-9]{10}$/
              })}
              onChange={(e) => setmobile(e.target.value)}
            />
            <div style={{ color: "red" }}>
              {errors.mobile && <p>*Please enter a valid mobile number</p>}
            </div>
          </div>
          <div className="col">
            <Form.Label>
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                Email
              </div>
            </Form.Label>
            <Form.Control
              style={{ borderRadius: "0.5cm",width:"60%" }}
              className="mx-3 form-control"
              type="text"
              value={email}
              placeholder="Email"
              {...register("email", {
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
              })}
              onChange={(e) => setemail(e.target.value)}
            />
            <div style={{ color: "red" }}>
              {errors.email && <p>*Please check the Email</p>}
            </div>
          </div>
        </div>
      </Form.Group>
          <br />
          <div className="row">
          <div className="col">
            <Form.Group>
              <Form.Label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                  Department
                </div>
              </Form.Label>
              <div className="mb-3">
                <div className="col-sm-7">
                  <div className='form-control-with-icon'>
                  <select className="w-60 mx-4 form-control" style={{ borderRadius: 40 }} value={departments} onChange={(e) => setDepartment(e.target.value)}>
                    <option style={{ textAlign: "center" }} value="" disabled>Select department</option>
                    <option style={{ textAlign: "center" }} value="IT">IT</option>
                    <option style={{ textAlign: "center" }} value="HR">HR</option>
                    <option style={{ textAlign: "center" }} value="DOCTOR">DOCTOR</option>
                    <option style={{ textAlign: "center" }} value="NURSE">NURSE</option>
                    <option style={{ textAlign: "center" }} value="LAB">LAB</option>
                    <option style={{ textAlign: "center" }} value="RT TECH">RT TECH</option>
                    <option style={{ textAlign: "center" }} value="PHARMACY">PHARMACY</option>
                    <option style={{ textAlign: "center" }} value="TELECALLER">TELECALLER</option>
                    <option style={{ textAlign: "center" }} value="FRONT OFFICE">FRONT OFFICE</option>
                    <option style={{ textAlign: "center" }} value="SECURITY">SECURITY</option>
                    <option style={{ textAlign: "center" }} value="ELECTRICIAN">ELECTRICIAN</option>
                    <option style={{ textAlign: "center" }} value="ACCOUNTS">ACCOUNTS</option>
                    <option style={{ textAlign: "center" }} value="HOUSE KEEPING">HOUSE KEEPING</option>
                    <option style={{ textAlign: "center" }} value="DENSIST CONSULTANT">DENSIST CONSULTANT</option>
                    <option style={{ textAlign: "center" }} value="COOK">COOK</option>
                  </select>
                  <i style={{ position: 'absolute', color: "gray", display: "flex", top: "45%",left:"100%", transform: "translateY(-50%)" }} className="fas fa-caret-down form-control-icon"></i>
              </div>
              </div>
              </div>
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                  Designation
                </div>
              </Form.Label>
              <Form.Control
                style={{ borderRadius: "0.5cm",width:"60%" }}
                className="mx-3 form-control"
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
        </div>

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
                  style={{ borderRadius: "0.5cm",width:"30%" }}
                  className="mx-3 form-control"
                  type="text"
                  value={TNMCNO}
                  placeholder="TNMCNO"
                  {...register("TNMCNO", {
                    pattern: /^[0-9]{12}$/,
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
            <div className="col">
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>
                    RNR NO
                  </div>
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: "0.5cm",width:"100%" }}
                  className="mx-3 form-control"
                  type="text"
                  value={RNRNO}
                  placeholder="RNRNO"
                  {...register("RNRNO", {
                    pattern: /^[0-9]{12}$/,
                  })}
                  onChange={(e) => setRNRNO(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.RNRNO && <p>*Please check the RNRNO</p>}
              </div>
              </div>
            <div className="col" style={{marginRight:"60%"}}>
              <Form.Group>
                <Form.Label>
                  <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>
                    Validity Date
                  </div>
                </Form.Label>
                <Form.Control
                  style={{ borderRadius: "0.5cm",width:"80%" }}
                  className="mx-3 form-control"
                  type="text"
                  value={ValidityDate}
                  placeholder="ValidityDate"
                  {...register("ValidityDate", {
                    pattern: /^\d{4}-\d{2}-\d{2}$/,
                  })}
                  onChange={(e) => setValidityDate(e.target.value)}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.ValidityDate && <p>*Please check the ValidityDate</p>}
              </div>
              </div>
            </div>
        )}
        <br />

        <div className="row">
          <div className="col">
            <Form.Group>
              <Form.Label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                  Aadhaar Number
                </div>
              </Form.Label>
              <Form.Control
                style={{ borderRadius: "0.5cm",width:"60%" }}
                className="mx-3 form-control"
                type="text"
                value={Aadhaarno}
                placeholder="Aadhaar No"
                {...register("Aadhaarno", {
                  pattern: /^[0-9]{12}$/,
                })}
                onChange={(e) => setAadhaarno(e.target.value)}
              />
            </Form.Group>
            <div style={{ color: "red" }}>
              {errors.Aadhaarno && <p>*Please check the Aadhaar No</p>}
            </div>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                  Pan Number
                </div>
              </Form.Label>
              <Form.Control
                style={{ borderRadius: "0.5cm",width:"60%" }}
                className="mx-3 form-control"
                type="text"
                value={PanNo}
                placeholder="Pan No"
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
        </div>
        <br />

          <div className="row">
          <div className="col">
            <Form.Group>
              <Form.Label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                  Bank Account Number
                </div>
              </Form.Label>
              <Form.Control
                style={{ borderRadius: "0.5cm",width:"60%" }}
                className="mx-3 form-control"
                type="text"
                value={bankaccnum}
                placeholder="Bank Account No"
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
          <div className="col">
            <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Address</div>
            </Form.Label>
            <Form.Control 
              style={{ borderRadius: "0.5cm",width:"60%" }}
              className="mx-3 form-control"
              as="textarea"
              type="text"
              value={address}
              placeholder="address"
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
        <div className="col-sm-4">
          <Form.Group>
            <Form.Label>
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Marital Status</div>
            </Form.Label>
            <div className="form-control-with-icon">
              <Form.Control as="select" className="mx-3" value={Maritalstatus} style={{ width: "25%" }} onChange={e => setMaritalstatus(e.target.value)}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
              <i style={{ position: 'absolute', color: "gray", display: "flex", top: "45%",left:"25%", transform: "translateY(-50%)" }} className="fas fa-caret-down form-control-icon"></i>
            </div>
          </Form.Group>
        </div>
        <div className="col-sm-4">
          <Form.Group>
            <Form.Label>
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Blood Group</div>
            </Form.Label>
            <div className="form-control-with-icon">
              <Form.Control as="select" className="mx-3" style={{ width: "25%" }} value={BloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Form.Control>
              <i style={{ position: 'absolute', color: "gray", display: "flex", top: "45%",left:"25%", transform: "translateY(-50%)" }} className="fas fa-caret-down form-control-icon"></i>
            </div>
          </Form.Group>
        </div>
          <div className="col-sm-4">
          <Form.Group>
          <div className="row">
          <div className="col-sm-6">
            <label>
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>Date Of Birth</div>
              <input style={{ width: "90%", fontSize: '14px' }}
                type="text"
                className="mx-2 form-control"
                placeholder="Select Date"
                readOnly
                onClick={() => document.getElementById('dob-picker').click()}
                value={dob ? dob.toLocaleDateString("en-GB") : ""}
              />
              <DatePicker
                id="dob-picker"
                selected={dob}
                onChange={handleDobChange}
                dateFormat="dd-MM-yyyy"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="d-none"
              />
            </label>
          </div>
            <div className="col-sm-6">
              <label>
                <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "16px" }}>Age</div>
                <input style={{width: "35%",fontSize:'14px'}}
                  type="text"
                  className="mx-2 form-control"
                  value={age}
                  placeholder='age'
                  readOnly
                />
              </label>
            </div>
          </div>
        </Form.Group>
        </div>
          </div> 
          <br/>  

          <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input id="selectFile" type="file" accept=".pdf" onChange={handleFileSelect} hidden />
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                PAN or Aadhaar proof
              </div>
              <label htmlFor="selectFile" className={`mx-5 bi ${isFileSelected ? "bi-folder-check" : "bi-folder-plus"}`} 
                style={{ fontSize: "40px", color: "cadetblue", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
              {proof && (
                <>
                <span style={{fontSize:"12px"}} className="mx-1">{proof.name}</span>
                <button style={{height:"0.5cm",width:"0.5cm",backgroundColor:"red",border:"none",color:"white",fontSize:"14px"}}  
                onClick={handleRemoveFile}>
                  <i className="fa fa-times"></i>
                </button>
              </>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <input id="selectCertificate" type="file" accept=".pdf" onChange={handleCertificateSelect} hidden />
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>
                Certificates
              </div>
              <label htmlFor="selectCertificate" className={`mx-4 bi ${isCertificateSelected ? "bi-folder-check" : "bi-folder-plus"}`} 
                style={{ fontSize: "40px", color: "cadetblue", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
              {certificates && (
                <>
                  <span style={{fontSize:"12px"}} className="mx-1">{certificates.name}</span>
                  <button style={{height:"0.5cm",width:"0.5cm",backgroundColor:"red",border:"none",color:"white",fontSize:"14px"}}  
                  onClick={handleRemoveCertificate}>
                    <i className="fa fa-times"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div><br/>
        <div style={{ display: "flex", float: "right" }}>
        <Button style={{ backgroundColor: "darkcyan", border: "none", marginRight: "50px" }} onClick={() => editemp('tab1')} type="submit" block>
          Save
        </Button>
      </div>
      <div style={{marginLeft: "270px",marginTop:"40px"}}>
      {tab1Message && (<div style={{color:"darkcyan",fontFamily:"cursive",fontSize:"18px"}}>{tab1Message}</div>)}
        </div>
      </div>
          )
    },
    {
      title: <div className="tab-title" id="educational-details">Educational Details</div> ,
      content: (
      <div class="tab-content" id='tab2'>
      {showMessage && (
      <p><b><center>You haven't added any education details yet!</center></b></p>
    )}
    {showTable && (
      <Form.Group>
      <Table striped hover className='emptable'>
      <thead>
        <tr>
          <th style={{textAlign:"center",color:"black"}}>SNo</th>
          <th style={{textAlign:"center",color:"black"}}>Degree</th>
          <th style={{textAlign:"center",color:"black"}}>Major</th>
          <th style={{textAlign:"center",color:"black"}}>Institution</th>
          <th style={{textAlign:"center",color:"black"}}>Marks</th>
          <th style={{textAlign:"center",color:"black"}}>Division</th>
          <th style={{textAlign:"center",color:"black"}}>Year</th>
        </tr>
      </thead>
      <tbody>
        {dataArray.map((data, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.degree}
                onChange={(e) => handleInputChange(e, index, "degree")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.major}
                onChange={(e) => handleInputChange(e, index, "major")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.institution}
                onChange={(e) => handleInputChange(e, index, "institution")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.marks}
                onChange={(e) => handleInputChange(e, index, "marks")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.division}
                onChange={(e) => handleInputChange(e, index, "division")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.year}
                onChange={(e) => handleInputChange(e, index, "year")}
              />
            </td>
          </tr>
        ))}
      </tbody>
      </Table>
      </Form.Group>
      )}
       <div style={{ display: "flex", float: "right" }}>
        <Button style={{ backgroundColor:"darkcyan", border: "none", marginRight: "10px" }} onClick={() => editemp('tab2')} type="submit" block>
          Save
        </Button>
      </div>
      <div style={{marginLeft: "300px",marginTop:"40px"}}>
      {tab2Message && (<div style={{color:"darkcyan",fontFamily:"cursive",fontSize:"18px"}}>{tab2Message}</div>)}
        </div>
      </div>
      )
    },
  ];

  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
      <VerticalTabs tabs={tabs}></VerticalTabs>
      </Form>
    </div>
  );
}
export default EditForm;