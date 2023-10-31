import Webcam from "react-webcam";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Label } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { Col, FormControl, Row } from "react-bootstrap";
import "./Addemp.css";
import Myconstants from "../Components/Myconstants";
import { Radio, Checkbox } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HorizontalTabs from "./HorizontalTabs";
import moment from "moment";




function Addemp() 
{
  const { employmentCategoryOptions,employeeTypeOptions } = Myconstants;
  const [Initial, setInitial] = useState('');
  const [page, setPage] = useState(1);
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imgSrcname, setImgSrcname] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const name = `${title} ${Initial} ${firstName}${lastName}`;
  const [id, setId] = useState("");
  const [mobile, setMobile] = useState("");
  const [shift, setshift] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("")
  const [dateofjoining, setDateOfJoining] = useState("");
  const [bankaccnum, setBankAccNum] = useState("");
  const [address, setAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState('');
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");
  const [isShown, setIsShown] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [RNRNO, setRNRNO] = useState("");
  const [TNMCNO, setTNMCNO] = useState("");
  const [ValidlityDate, setValidlityDate] = useState("");
  const [Gender, setGender] = useState("");
  const [Maritalstatus, setMaritalstatus] = useState("");
  const [Aadhaarno, setAadhaarno] = useState("");
  const [PanNo, setPanNo] = useState("");
  const [BloodGroup, setBloodGroup] = useState("");
  const [languages, setLanguages] = useState([]);
  const[PF,setPF]= useState("");
  const[ESINO,setESINO]= useState("");
  const [reportedBy, setReportedBy] = useState('');
  const [employmentCategory, setEmploymentCategory] = useState(''); // Initialize with an empty string
  const [employeeType, setEmployeeType] = useState('');
  const [medicalClaimPolicyNo, setMedicalClaimPolicyNo] = useState('');
  const [validityDateFrom, setValidityDateFrom] = useState(null);
  const [validityDateTo, setValidityDateTo] = useState(null);
  const [bankName, setBankName] = useState('');
  const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  const [ifscCode, setIfscCode] = useState('');
  const[experienceFrom,setexperienceFrom]=useState(null);
  const[experienceTo,setexperienceTo]=useState(null);
  const [yearsOfExperience, setYearsOfExperience] = useState({ years: 0, months: 0 });
  
  const [educationData, setEducationData] = useState([
    { SlNo: 1, Degree: '', major: '', institution: '', marks: '', division: '', year: '' }
  ]);

  const [experienceData, setExperienceData] = useState([
    { SlNo: 1, Organization: "", designation: "", lastdrawnsalary: "", location: "", experience: "" },
  ]);

  const [assetDetails, setAssetDetails] = useState([
    { slNo: 1, description: '', modelSerialNo: '' }
  ]);
  
  const addRow = (tableType) => {
    if (tableType === 'experience') {
      setExperienceData([...experienceData, { SlNo: experienceData.length + 1, Organization: "", designation: "", lastdrawnsalary: "", location: "", experience: "" }]);
    } else if (tableType === 'asset') {
      setAssetDetails([...assetDetails, { slNo: assetDetails.length + 1, description: "", modelSerialNo: "" }]);
    } else if (tableType === 'education') {
      const newRowData = {
        SlNo: educationData.length + 1,
        degree: '',
        major: '',
        institution: '',
        marks: '',
        division: '',
        year: ''
      };
      setEducationData([...educationData, newRowData]);
    }
  };
  
  
  const [referenceData, setReferenceData] = useState([
    { SlNo: 1, references: "", Organization: "", designation: "", ContactNo: "" },

  ]);

  const [showReferenceDetails, setShowReferenceDetails] = useState(false);

  // const referenceData = []; // Replace with your actual reference data

  const handleReferenceClick = () => {
    setShowReferenceDetails(true);
  };

  const handleCloseReferenceDetails = () => {
    setShowReferenceDetails(false);
  };


  const handleAddRow = () => {
    const newRow = { SlNo: referenceData.length + 1, references: "", Organization: "", designation: "", ContactNo: "" };
    setReferenceData([...referenceData, newRow]);
  };


 
  const handleAssetContentEditableChange = (index, fieldName, newValue) => {
    const updatedAssetDetails = [...assetDetails];
    updatedAssetDetails[index][fieldName] = newValue;
    setAssetDetails(updatedAssetDetails);
  };
  

  const handleEducationContentEditableChange = (index, fieldName, newValue) => {
    if (fieldName === "major") {
      validateMajor(newValue);
    } else if (fieldName === "institution") {
      validateInstitution(newValue);
    } else if (fieldName === "marks") {
      validateMarks(newValue);
    } else if (fieldName === "division") {
      validateDivision(newValue);
    } else if (fieldName === "year") {
      validateYear(newValue);
    }
  
    const updatedEducationData = [...educationData];
    updatedEducationData[index][fieldName] = newValue;
    setEducationData(updatedEducationData);
  };
  
  const handleReferenceContentEditableChange = (index, fieldName, newValue) => {
    const updatedReferenceData = [...referenceData];
    updatedReferenceData[index][fieldName] = newValue;
    setReferenceData(updatedReferenceData);
  };

  const handleexpFromDateChange = (date) => {
    setexperienceFrom(date);
    handleExperienceChange(); // Calculate years and months when "experienceFrom" changes
  };
  
  const handleexpToDateChange = (date) => {
    setexperienceTo(date);
    handleExperienceChange(); // Calculate years and months when "experienceTo" changes
  };
  
  console.log("yearsofexp:",yearsOfExperience)

  // experience Handle date changes
  const handleDateChange = (date, rowIndex, type) => {
  const updatedExperienceData = [...experienceData];
  const rowData = updatedExperienceData[rowIndex];

  if (type === "experienceFrom") {
    rowData.experience= date;
  } else if (type === "experienceTo") {
    rowData.experience = date;
  }

  // Update the state with the new data
  setExperienceData(updatedExperienceData);
};

 // Calculate years and months of experience when date changes
 useEffect(() => {
  if (experienceFrom && experienceTo) {
    const fromDate = new Date(experienceFrom);
    const toDate = new Date(experienceTo);

    const diff = toDate - fromDate;
    const years = diff / 31536000000; // 1000 milliseconds * 60 seconds * 60 minutes * 24 hours * 365 days
    const months = (years % 1) * 12;

    setYearsOfExperience({
      years: Math.floor(years),
      months: Math.round(months),
    });
  } else {
    setYearsOfExperience({ years: 0, months: 0 }); // Reset to 0 if dates are not selected
  }
}, [experienceFrom, experienceTo]);


  //Functions for selecting department using dropdown
  function handleChange(e) {
    setSelectedDepartment(e.target.value);
    if (e.target.value === "DOCTOR") {
      setTNMCNO("");

    } else if (e.target.value === "NURSE") {
      setRNRNO("");
      setValidlityDate("");
    }
  }

  const handleOnChange = (e, rowIndex, field) => {
    const updatedData = [...educationData];
    updatedData[rowIndex][field] = e.target.value;
    setEducationData(updatedData);
  }

  const handleChangeexp = (e, index, key) => {
    const { value } = e.target;
    const newData = [...experienceData];
    newData[index][key] = value;
    setExperienceData(newData);
  };

  const handleChangeref = (event, index, key) => {
    const newData = [...referenceData];
    newData[index][key] = event.target.value;
    setReferenceData(newData);
  };

  const handleClick = (event) => {
    console.log("handleClick called");
    setIsShown((current) => !current);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const handleImageSelect = (event) => {
    setImgSrc(event.target.files[0]);
  };

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isCertificateSelected, setIsCertificateSelected] = useState(false);

  const handleFileSelect = (e) => {
    setProof(e.target.files[0]);
    setIsFileSelected(true);
  };

  const handleCertificateSelect = (e) => {
    setCertificate(e.target.files[0]);
    setIsCertificateSelected(true);
  };

  const handleRemoveCertificate = () => {
    setCertificate(null);
    setIsCertificateSelected(false);
    document.getElementById("selectCertificate").value = "";
  };

  const [dob, setDob] = useState(null); // Initialize the DOB state with current date
  const [age, setAge] = useState(''); // Initialize the age state with 0


  const handleDobChange = (date) => {
      setDob(date);
      setAge(getAge(date));
    };

    const getAge = (dob) => {
      if (!dob) {
        return '';
      }
      const diffMs = Date.now() - dob.getTime();
      const ageDt = new Date(diffMs);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

  const onSubmit = async (details) => {
    const data = new FormData();
    const comprefaceImage = new FormData();
    data.append("name", name);
    data.append("id", id);
    data.append("Gender", Gender);
    data.append("mobile", mobile);
    data.append("dob", dob.toISOString().split('T')[0]);
    data.append("age",age);
    data.append("department", selectedDepartment);
    data.append("RNRNO", RNRNO);
    data.append("languages",languages);
    data.append("TNMCNO", TNMCNO);
    data.append("ValidlityDate", ValidlityDate);
    data.append("designation", designation);
    data.append("email", email);
    data.append("dateofjoining", dateofjoining);
    data.append("bankaccnum", bankaccnum);
    data.append("address", address);
    data.append("Maritalstatus", Maritalstatus);
    data.append("Aadhaarno", Aadhaarno);
    data.append("PanNo", PanNo);
    data.append("salary", salary);
    data.append("shift", shift);    
    data.append("BloodGroup", BloodGroup);
    data.append("educationData", JSON.stringify(educationData));
    data.append("experienceData", JSON.stringify(experienceData));
    data.append("referenceData", JSON.stringify(referenceData));
    data.append("assetDetails", JSON.stringify(assetDetails));
    data.append("imgSrc", imgSrc);
    data.append("", imgSrc);
    data.append("PF",PF);
    data.append("ESINO",ESINO);
    data.append("employmentCategory",employmentCategory);
    data.append("employeeType",employeeType);
    data.append("medicalClaimPolicyNo",medicalClaimPolicyNo);
    data.append("validityDateFrom",validityDateFrom.toISOString().split('T')[0]);
    data.append("validityDateTo",validityDateTo.toISOString().split('T')[0]);
    data.append("bankName",bankName);
    data.append("bankaccnum",bankaccnum);
    data.append("ifscCode",ifscCode);
    data.append("companyEmail",companyEmail);reportedBy
    data.append("reportedBy",reportedBy);






    comprefaceImage.append("file", imgSrc);
    let formDataNew = new FormData();
    formDataNew.append("file", imgSrc);
    let formData = new FormData();
    
    console.log(data)
    try {
      const res = await axios({
        method: "post",
        url: "http://127.0.0.1:7000/attendance/addemp/",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data,
      });

      if (res.status === 200) {
        setMessage(Myconstants.AddEmp);
      } else {
        setMessage(Myconstants.AddEmpError);
      }
    }
    catch (err) {
    }
  };

  // Refresh function
  function refreshPage() {
    {
      window.location.reload();
    }
  }
  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  //converting "Base64" to javascript "File Object"
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename);
  }
  const handleDateofjoiningChange = (date) => {
    setDateOfJoining(date);
  };
   // Validation for forms
   function validateName(name) {
    let error = "";
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    if (!capitalized.match(/^[a-zA-Z\s.]*$/)) {
      error = "*Name should only contain letters, spaces, and periods";
    }
    return error;
  }
  function validateSalary(salary) {
    let error = "";
    if (salary !== "" && !/^\d+$/.test(salary)) {
      error = "*Only numbers are allowed";
    }
    return error;
  }
  function validateId(id) {
    let error = "";
    if (!id.match(/^[0-9]*$/)) {
      error = "*Id should contain numbers only";
    }
    return error;
  }
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }

  function validateDesignation(designation) {
    if (!designation.match(/^[a-zA-Z\s]*$/)) {
      return "*Designation should only contain letters and spaces";
    }
    return "";
  }
  
  function validatePanNo(PanNo) {
    let error = "";
    if (PanNo !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PanNo)) {
      error = "*Invalid PAN Card Number";
    }
    return error;
  }

  function validateAadhaarNo(AadhaarNo) {
    let error = "";
    if (AadhaarNo !== "" && !/^(\d{4}\s?){2}\d{4}$/.test(AadhaarNo)) {
      error = "*Invalid Aadhaar Number. Aadhaar should be 12 Digits with allowed spaces.";
    }
    return error;
  }

  function validateEmail(email) {
    let error = "";
    if (email !== "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      error = "*Invalid email address";
    }
    return error;
  }

  function validateDateOfJoining(dateofjoining) {
    let error = "";
    if (dateofjoining !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dateofjoining)) {
      error = "*Invalid date format. Please use YYYY-MM-DD";
    }
    return error;
  }

  function validateBankAccNum(bankaccnum) {
    let error = "";
    if (bankaccnum !== "" && !/^[0-9]{9,18}$/.test(bankaccnum)) {
      error = "*Invalid bank account number. It should contain 9 to 18 digits";
    }
    return error;
  }

  function validateAddress(address) {
    let error = "";
    if (!address.match(/^[0-9/,a-zA-Z- 0-9.]*$/)) {
      error = "*Address should only contain numbers, letters, commas, dots, slashes, and spaces";
    }
    return error;
  }
  const handleOnChangeeducation = (e, index, field) => {
    const { value } = e.target;
    setEducationData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  const validateMajor = (major) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!major) {
      return " ";
    } else if (!regex.test(major)) {
      return "Only alphabets with spaces allowed in Major field";
    } else {
      return null;
    }
  };
  const validateInstitution = (institution) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!institution) {
      return " ";
    } else if (!regex.test(institution)) {
      return "Only alphabets with spaces allowed in Institution field";
    } else {
      return null;
    }
  };
  const validateMarks = (marks) => {
    const regex = /^[0-9]*$/;
    if (!marks) {
      return " ";
    } else if (!regex.test(marks)) {
      return "Only numbers allowed in Marks field";
    } else {
      return null;
    }
  };
  

  const [languagesError, setLanguagesError] = useState("");
  const validateLanguages = () => {
    let error = "";
    if (languages !== "" && !/^[a-zA-Z]+(,[a-zA-Z]+)*$/.test(languages)) {
      error = "*Only alphabets and commas are allowed";
    }
    setLanguagesError(error);
  };

  const validateYear = (year) => {
    const regex = /^(19|20)\d{2}$/;
    if (!year) {
      return " ";
    } else if (!regex.test(year)) {
      return "Only valid years allowed in Year of Passing field";
    } else {
      return null;
    }
  };
  const handleOnChangeexperience = (value, index, field) => {
    setExperienceData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  
  const validateOrganization = (organization) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!organization) {
      return " ";
    } else if (!regex.test(organization)) {
      return "Only alphabets with spaces allowed in Organization field";
    } else {
      return null;
    }
  };
  const validateexpDesignation = (designation) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!designation) {
      return " ";
    } else if (!regex.test(designation)) {
      return "Only alphabets with spaces allowed in Designation field";
    } else {
      return null;
    }
  };
  const validateLastDrawnSalary = (lastDrawnSalary) => {
    const regex = /^[0-9]*$/;
    if (!lastDrawnSalary) {
      return " ";
    } else if (!regex.test(lastDrawnSalary)) {
      return "Only numbers allowed in Last Drawn Salary field";
    } else {
      return null;
    }
  };
  const validateLocation = (location) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!location) {
      return " ";
    } else if (!regex.test(location)) {
      return "Only alphabets with spaces allowed in Location field";
    } else {
      return null;
    }
  };
  const validateExperience = (experience) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}\sto\s(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!experience) {
      return " ";
    } else if (!regex.test(experience)) {
      return "Experience field should be in the format of 'dd/mm/yyyy to dd/mm/yyyy'";
    } else {
      return null;
    }
  };
  const handleOnChangeReference = (e, index, field) => {
    const { value } = e.target;
    setReferenceData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  const validateReferences = (references) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!references) {
      return " ";
    } else if (!regex.test(references)) {
      return "Only alphabets with spaces allowed in References field";
    } else {
      return null;
    }
  };
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }
  const validaterefContactNo = (contactNo) => {
    const isValidPhone = /^\d{10}$/.test(contactNo);
    const isValidLandline = /^\d{8}$/.test(contactNo);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactNo);
    if (contactNo !== "" && !isValidPhone && !isValidLandline && !isValidEmail) {
      return "Invalid Contact Details";
    } else {
      return null;
    }
  }

  function validatePF(PF) {
    if (PF.trim() === "") {
      return " ";
    }
  
    if (!/^\d+$/.test(PF)) {
      return "PF must be a valid integer";
    }
  
    return null; // Return null if validation succeeds
  }
  function validateESINO(ESINO) {
    if (!ESINO) {
      return " ";
    }
  
    if (!/^\d+$/.test(ESINO)) {
      return "ESINO must be a valid integer";
    }
      return null; // Return null if validation succeeds
  }


   // Function to handle changes in the "Reported By" input
   const handleReportedByChange = (e) => {
    setReportedBy(e.target.value);
  };

  
  const handleBankNameChange = (e) => {
    // Allow all types of characters
    setBankName(e.target.value);
  };
  const DEPARTMENT_OPTIONS = Myconstants.departments;
  const [proofFile, setProofFile] = useState(null);
  const [certificatesFile, setCertificatesFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const[uploadFile,setuploadFile]=useState(null);


  useEffect(() => {
    if (imgSrc) {
      setImage(URL.createObjectURL(imgSrc));
    }
  }, [imgSrc]);
  const Capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    toDataURL(imageSrc).then((dataUrl) => {
      var fileData = dataURLtoFile(dataUrl, "image.jpg");
      setProfileImageFile(fileData);
      setImageSrc(imageSrc)
      console.log("____",fileData)
      
    });
  }, [webcamRef, setImgSrc]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (event.target.name === 'proof') {
      setProofFile(file);
    } else if (event.target.name === 'certificates') {
      setCertificatesFile(file);
    } else if (event.target.name === 'imgSrc') {
      setProfileImageFile(file);
    } else if (event.target.name === 'uploadFile') {
      setuploadFile(file);
    }
  };
  const handleRemoveFile = () => {
    setProofFile(null);
    document.getElementById("selectFile").value = "";
  };
  const handleRemoveFile3 = () => {
    setCertificatesFile(null);
    document.getElementById("selectFile").value = "";
  };
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    document.getElementById("selectImage").value = "";
  };

  const handleRemoveFile2 =(e)=>{
    setuploadFile(null);
    document.getElementById("selectFile").value = "";
  }
  const handleSubmit2 = async () => {
    const formData = new FormData();
    formData.append('employee_name', name);
    formData.append('employee_id', id);
    formData.append('proof', proofFile);
    formData.append('certificates', certificatesFile);
    formData.append('imgSrc', profileImageFile);
    formData.append('uploadFile',uploadFile);
   
    try {
      await axios.post('http://127.0.0.1:7000/attendance/upload_file/', formData);
      // Handle successful file upload
      console.log('Files uploaded successfully');
      setUploadSuccess(true);
    } catch (error) {
      // Handle error
      console.error('File upload failed:', error);
    }
  };
  
  const handleCombinedClick = async () => {
    console.log("handleCombinedClick called");
    await handleSubmit2();
    handleClick();
  };

  const handleCategoryChange = (e) => {
    setEmploymentCategory(e.target.value);
  };

  const handleEmployeeTypeChange = (e) => {
    setEmployeeType(e.target.value);
  };
  const handleMedicalClaimPolicyNoChange = (e) => {
    setMedicalClaimPolicyNo(e.target.value);
  };


  const handleFromDateChange = (date) => {
    setValidityDateFrom(date);
  };

  const handleToDateChange = (date) => {
    setValidityDateTo(date);
  };

 
  const handleIfscCodeChange = (e) => {
    // Check if the input only contains letters (both uppercase and lowercase) and numbers
    if (/^[a-zA-Z0-9]*$/.test(e.target.value)) {
      setIfscCode(e.target.value);
    }
  };

  const isValidDate = (date) => datePattern.test(date);
  const nextPage = () => {
    if (page < 3) { // Assuming you have three pages
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  const tabs =[
      {
      title: "Personal Details",
      content:(
        <div>
          <br/>
        <Form onSubmit={handleSubmit(onSubmit)}>
     <div>
<center>
     <div className="row">
              <div className="col-sm-6">
                  <Webcam style={{ height: "50%", width: "50%",marginLeft:"30%"}}  onClick={Capture} audio={false} ref={webcamRef} screenshotFormat="image/jpg" />
                  <div style={{marginLeft:"30%",fontFamily:"serif"}}>Click Camera to Capture</div>
                </div>
              <div className="col-sm-4">
                <input
                  id="selectImage"
                  type="file"
                  accept=".jpg"
                  onChange={handleFileChange}
                  hidden
                  name="imgSrc"
                />
                  <label
                  htmlFor="selectImage"
                  className="bi bi-plus fa-lg"
                  style={{
                    color: "skyblue",
                    cursor: "pointer",
                    marginLeft:"-100%",
                    marginTop:"15%"
                  }}
                >Choose image</label>
                {profileImageFile && (
                  <>
                    <span className="mx-2">{profileImageFile.name}</span>
                    <button className="btn btn-danger" onClick={handleRemoveImage}>
                      <i className="fa fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </div></center>

    <div className="row" style={{marginTop:"-5%"}}>
    <div className="col-md-3">
    <div className="row">
    <div className="col-sm-6">
              <Form.Field>
              <select className=" mx-4 form-control" value={title} style={{width:'100%'}} onChange={(e) => setTitle(e.target.value)}>
                <option value="" disabled>Salutation</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Mr">Mr</option>
              </select>
              </Form.Field>
            </div>

            <div className="col-sm-6">
            <Form.Field>
            
              <input
                className=" mx-4 form-control"
                style={{width:'100%'}}
                type="text"
                value={Initial}
                placeholder="Initial"
                onChange={(e) => setInitial(e.target.value)}
                required
              />
              </Form.Field>
            </div>
            </div>
            </div>

            <div className="col-md-3">
            <Form.Field>
             
              <input
                className=" mx-4 form-control"
                type="text"
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              </Form.Field>
            </div>

            <div className="col-md-3">
            <Form.Field>
              
              <input
                className=" mx-4 form-control"
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              </Form.Field>
            </div>

            <div className="col-md-3">
            <input 
              className=" mx-4 form-control"
              type="text"
              value={id}
              placeholder=" Id "
              ref={register("id", { pattern: /^[0-9]*$/ })}
              required
              autoComplete="off"
              onChange={(e) => {
                setId(e.target.value);
                validateId(e.target.value);
              }}
            />
              <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>
                {validateId(id) ? <p>{validateId(id)}</p> : null}
              </div>
              
          </div>
      </div>

<br/>

      <div className="row">
         

          <div className="col-md-3">
            <input 
              className=" mx-4 form-control"
              type="text"
              value={mobile}
              placeholder=" Mobile Number"
              ref={register("mobile", { pattern: /^[0-9]{10}$/ })}
              required
              autoComplete="off"
              onChange={e => { setMobile(e.target.value); validateMobile(e.target.value); }}
            />
              <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>
                {validateMobile(mobile) ? <p>{validateMobile(mobile)}</p> : null}
              </div>
          </div>

          <div className="col-md-3"> 
          <input 
                        className=" mx-4 form-control"
                        type="text"
                         value={email}
                       placeholder="Email Id"
                       ref={register("email", { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                        required
                        autoComplete="off"
                        onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "22%", marginTop: "2%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateEmail(email) ? validateEmail(email) : null}</div>
                       
          </div>   

       <div className="col-md-3"> 

       <input
                         className=" mx-4 form-control"
                         type="text"
                         value={address}
                        placeholder="Address"
                        ref={register("address", { pattern: /^[0-9/,a-zA-Z- 0-9.]*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setAddress(e.target.value); validateAddress(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateAddress(address) ? <p>{validateAddress(address)}</p> : null}</div>
                      </div>

                      <div className="col-md-3"> 
     <Form.Field>
      <div>
        
        <select
          className="mx-4 form-control"
          value={Gender}
          onChange={(e) => setGender(e.target.value)}
        >
           <option value="" disabled>Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </Form.Field>
</div>
 </div>

<br/>



  <div className="row">
   <div className="col-md-3"> 
 <div className="row">
 <div className="col-sm-8"> 
 <Form.Field>
        <input 
          type="text"
         className="mx-4 form-control"
          placeholder="Date of Birth"
          style={{ width:"100%" }}
          readOnly
          onClick={() => document.getElementById('dob-picker').click()}
          value={dob ? dob.toDateString() : ''}
      />
        <DatePicker
          id="dob-picker"
         selected={dob}
         onChange={handleDobChange}
          dateFormat="yyyy-MM-dd"
          peekNextMonth
         showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className="d-none"
        />
        </Form.Field>
      </div>
 <div className="col-sm-4"> 
 <Form.Field>
         <input
           type="text"
          className="mx-4 form-control"
          placeholder="Age"
          value={age}
          readOnly
        />
        </Form.Field>
      </div>
</div>
</div>

<div className="col-md-3"> 

                  <Form.Field>
                       <select  className="mx-4 form-control" value={Maritalstatus}  onChange={e => { setMaritalstatus(e.target.value); }}>
                        <option value="" disabled>Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="separated">separated</option>
                         <option value="divorced">divorced</option>
                       </select>
                    </Form.Field>
</div>

<div className="col-md-3"> 

<Form.Field>

<select   className="mx-4 form-control" value={BloodGroup} onChange={e => { setBloodGroup(e.target.value); }}>
                          <option value="">Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O-</option>
                            <option value="O-">O-</option>
                          </select>
</Form.Field>

</div>


<div className="col-md-3"> 
              <Form.Field>
                      <input 
                        className=" mx-4 form-control"
                           type="text"
                         value={languages}
                        placeholder="Languages known"
                         ref={register("languages", { pattern: /^[a-zA-Z]+(,[a-zA-Z]+)*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setLanguages(e.target.value); validateLanguages(e.target.value); }}
                      />
                     {languagesError && (
                      <div
                        style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace: "nowrap", fontSize: "12px" }}
                      >
                       {languagesError}
                      </div>
                    )}                   
               </Form.Field>
               </div>
</div>
    <br/>
   
   
                                  <center>
                                  <h4 style={{ fontFamily: 'serif' }}>KYC-Details</h4>
                                </center>
                                <br/>

<div className="row">
     <div className="col-md-3"> 

                   <Form.Field>
                        <input 
                          className="mx-4 form-control"
                          type="text"
                          value={Aadhaarno}
                          placeholder="Aadhaar No"
                          ref={register("Aadhaarno")}
                          required // add this attribute to make Aadhaar number a mandatory field
                          autoComplete="off"
                          onChange={e => { setAadhaarno(e.target.value);validateAadhaarNo(e.target.value);}}
                        />
                      <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateAadhaarNo(Aadhaarno) ? <p>{validateAadhaarNo(Aadhaarno)}</p> : null}</div>   
              </Form.Field>
     </div>
     
     <div className="col-md-3"> 
                  <Form.Field>
                      <input
                        className="mx-4 form-control"
                        type="text"
                        value={PanNo}
                        placeholder=" PAN No"
                        ref={register("PanNo", { pattern: /^[A-Z0-9]*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setPanNo(e.target.value);validatePanNo(e.target.value);  }}
                      />
                       <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validatePanNo(PanNo) ? <p>{validatePanNo(PanNo)}</p> : null}</div>
                    </Form.Field>
 </div>             

 <div className="col-md-3"> 
 <input
            id="selectFile"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            hidden
            name="proof"
          />
            <label
            htmlFor="selectFile"
            className="bi bi-plus fa-lg"
            style={{
              color: "skyblue",
              marginTop:"3%",
              marginLeft:"8%",
              cursor: "pointer",
            }}
          >Choose PAN / Aadhaar</label>
          {proofFile && (
            <>
              <span className="mx-3">{proofFile.name}</span>
              <button className="btn btn-danger" onClick={handleRemoveFile}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
 </div>  


</div>
<br/>



 <div className="row">
     <div className="col-md-3"> 
                   <Form.Field>
                      <input 
                        className=" mx-4 form-control"
                        type="text"
                        value={bankaccnum}
                        placeholder="Bank Account Number"
                        ref={register("bankaccnum", { pattern: /^[0-9]{9,18}$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setBankAccNum(e.target.value); validateBankAccNum(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateBankAccNum(bankaccnum) ? <p>{validateBankAccNum(bankaccnum)}</p> : null}</div>
                      </Form.Field>

 </div>  

 <div className="col-md-3"> 

      <input
       className=" mx-4 form-control"
       placeholder="Bank Name"
        type="text"
        id="bankName"
        value={bankName}
        onChange={handleBankNameChange}
      />
   </div>
  

<div className="col-md-3"> 

      <input
       className=" mx-4 form-control"
       placeholder="IFSC Code"
        type="text"
        id="ifscCode"
        value={ifscCode}
        onChange={handleIfscCodeChange}
      />
    </div>
   
</div>
</div>
             </Form> 
              </div>  
                )   
              },

              {
                title: "Educational Details",
                content:(
                    <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <br/>
              <div><b>EDUCATIONAL QUALIFICATIONS:</b></div><br />
       <table className="table table-bordered">
      <thead>
        <tr align="center">
          <th style={{ padding: "0 30px", fontSize: "15px" }}>Sl.No</th>
          <th style={{ padding: "0 30px", fontSize: "15px" }}>Degree</th>
          <th style={{ padding: "0 30px", fontSize: "15px" }}>Major</th>
          <th style={{ padding: "0 30px", fontSize: "15px" }}>Institution & University</th>
          <th style={{ padding: "0 30px", fontSize: "15px" }}>% of Marks</th>
          <th style={{ padding: "0 30px", fontSize: "15px" }}>Year of Passing</th>
          
        </tr>
      </thead>
      <tbody>
          {educationData.map((data, index) => (
            <tr key={index}>
              <td align="center">{data.SlNo}</td>
              <td
                contentEditable
                onBlur={(e) => handleEducationContentEditableChange(index, "degree", e.target.textContent)}
              >
                {data.Degree}
                <div style={{ color: "red" }}>{/* Validation for degree */}</div>
              </td>
              <td
                contentEditable
                onBlur={(e) => handleEducationContentEditableChange(index, "major", e.target.textContent)}
              >
                {data.major}
                <div style={{ color: "red" }}>{/* Validation for major */}</div>
              </td>
              <td
                contentEditable
                onBlur={(e) => handleEducationContentEditableChange(index, "institution", e.target.textContent)}
              >
                {data.institution}
                <div style={{ color: "red" }}>{/* Validation for institution */}</div>
              </td>
              <td
                contentEditable
                onBlur={(e) => handleEducationContentEditableChange(index, "marks", e.target.textContent)}
              >
                {data.marks}
                <div style={{ color: "red" }}>{/* Validation for marks */}</div>
              </td>
              <td
                contentEditable
                onBlur={(e) => handleEducationContentEditableChange(index, "year", e.target.textContent)}
              >
                {data.year}
                <div style={{ color: "red" }}>{/* Validation for year */}</div>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => addRow('education')} className="btn btn-primary">Add Row</button>
      </div>
<br/>
<br/>
<div className="row">
  <div className="col-sm-6">
    <div className="mx-5 form-group">
      <label htmlFor="formFileMultiple" className="bi bi-plus fa-lg" style={{
        fontFamily:"serif",
        color: "skyblue",
        cursor: "pointer",
      }}>Choose Certificates
      </label>
      <input
        id="formFileMultiple"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        multiple
        hidden
        name="certificates"
      />
      {certificatesFile && (
            <>
              <span className="mx-3">{certificatesFile.name}</span>
              <button className="btn btn-danger" onClick={handleRemoveFile3}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
    </div>
  </div>
</div>


         <br/>
           </Form>
           )
         },
  
         {
          title: "Professional Details",
            content:(
              <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
     <div><b>EXPERIENCE DETAILS:</b></div><br />
                <div>
                <table className="table table-bordered">
                    <thead>
                      <tr align="center">
                        <th style={{ padding: "0 30px", fontSize:"15px" }}>Sl.No</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }}>Name of the Hospital/Organization</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }}>Designation</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }}>Last Drawn Salary(CTC)</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }}>Location</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }} colSpan={2}>Experience From/To</th>
                        <th style={{ padding: "0 30px", fontSize:"15px" }} >years Of Experience</th>
                      </tr>
                    </thead>
                    <tbody>
  {experienceData.map((data, index) => (
    <tr key={index}>
      <td align="center">{data.SlNo}</td>
      <td
        contentEditable
        onBlur={(e) => {
          handleDateChange(e, index, "organization");
          validateOrganization(e.target.textContent);
        }}
      >
        {data.organization}
        <div style={{ color: "red" }}>{validateOrganization(data.organization)}</div>
      </td>
      <td
        contentEditable
        onBlur={(e) => {
          handleDateChange(e, index, "designation");
          validateDesignation(e.target.textContent);
        }}
      >
        {data.designation}
        <div style={{ color: "red" }}>{validateexpDesignation(data.designation)}</div>
      </td>
      <td
        contentEditable
        onBlur={(e) => {
          handleDateChange(e, index, "lastdrawnsalary");
          validateLastDrawnSalary(e.target.textContent);
        }}
      >
        {data.lastdrawnsalary}
        <div style={{ color: "red" }}>{validateLastDrawnSalary(data.lastdrawnsalary)}</div>
      </td>
      <td
        contentEditable
        onBlur={(e) => {
          handleDateChange(e, index, "location");
          validateLocation(e.target.textContent);
        }}
      >
        {data.location}
        <div style={{ color: "red" }}>{validateLocation(data.location)}</div>
      </td>
      <td colSpan={2}
        contentEditable
        onBlur={(e) => {
          handleDateChange(e, index, "experience");
          validateExperience(e.target.textContent);
        }}
      >
      {data.experience}
      <div style={{ color: "red" }}>{validateExperience(data.experience)}</div>

   
      <div style={{ display: 'flex', alignItems: 'center' }}>
  <DatePicker
    selected={experienceFrom}
    onChange={handleexpFromDateChange}
    placeholderText="From"
    dateFormat="MM/dd/yyyy"
    peekNextMonth
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
  />
  <span>&nbsp;</span> {/* A spacer */}
  <DatePicker 
    selected={experienceTo}
    onChange={handleexpToDateChange}
    placeholderText="To"
    dateFormat="MM/dd/yyyy" // Define the desired date format
    peekNextMonth    
    showMonthDropdown              
    showYearDropdown
    dropdownMode="select"
  />
</div>
</td>

<td>
  {yearsOfExperience.years} years {yearsOfExperience.months} months
</td>

  </tr>
  ))}
</tbody>
     </table>
     <br/>
     <button onClick={() => addRow('experience')} className="btn btn-primary">Add Row</button>
      </div>
    </div>
    <br/>               

    <div className="row">
      <div className="col-sm-6">
        <button className="btn btn-primary" onClick={handleReferenceClick}>
          <i className="bi bi-plus"></i> Reference Details
        </button>
      </div>
      <br/>
      {showReferenceDetails && (
        <div>
         <br/>
          <div>
            <b>REFERENCE OF PREVIOUS COMPANY:</b>
          </div>
          <br/>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>References:Name</th>
                <th>Organization</th>
                <th>Designation</th>
                <th>Contact No/Email</th>
              </tr>
            </thead>
            <tbody>
              {referenceData.map((data, index) => (
                <tr key={index}>
                  <td>{data.SlNo}</td>
                  <td contentEditable onBlur={(e) => handleReferenceContentEditableChange(index, "references", e.target.textContent)}>
                    {data.references}
                    <div style={{ color: "red" }}>{validateReferences(data.references)}</div>
                  </td>
                  <td contentEditable onBlur={(e) => handleReferenceContentEditableChange(index, "Organization", e.target.textContent)}>
                    {data.Organization}
                    <div style={{ color: "red" }}>{validateReferences(data.Organization)}</div>
                  </td>
                  <td contentEditable onBlur={(e) => handleReferenceContentEditableChange(index, "designation", e.target.textContent)}>
                    {data.designation}
                    <div style={{ color: "red" }}>{validateReferences(data.designation)}</div>
                  </td>
                  <td contentEditable onBlur={(e) => handleReferenceContentEditableChange(index, "ContactNo", e.target.textContent)}>
                    {data.ContactNo}
                    <div style={{ color: "red" }}>{validaterefContactNo(data.ContactNo)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleAddRow}>Add Row</button>
              <br/>   <br/>
          <div>
            <button className="btn btn-primary" onClick={handleCloseReferenceDetails}>Close</button>
          </div>
        </div>
      )}
    </div>

   </Form>
            )
          },

          {
            title: "Offer Information",
            content: (
              <Form onSubmit={handleSubmit(onSubmit)}>

                <br/>
                <div>

  <div className="row">
                <div className="col-md-3">
                  <Form.Field>
                    <input
                      type="email"
                      className="form-control"
                      id="companyEmail"
                      placeholder="Company Email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                    />
                  </Form.Field>
                </div>

                    <div className="col-md-3">
                      <Form.Field>
                        <select className="mx-4 form-control"   value={selectedDepartment} onChange={handleChange}>
                          <option style={{ textAlign: "center" }} value="" disabled>Select Department</option>
                          {DEPARTMENT_OPTIONS.map((department, index) => (
                            <option style={{ textAlign: "center" }} key={index} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </Form.Field>
                    </div>

                    {selectedDepartment === "DOCTOR" && (
                      <Form.Field>
                        <label className="mx-3 form-label">
                          <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>TnmcNo</div>
                        </label>
                        <div className="col-sm-7">
                          <input 
                            className="mx-4 form-control"
                            type="text"
                            placeholder="Enter your TnmcNo"
                            ref={register("TNMCNO")}
                            required
                            autoComplete="off"
                            onChange={e => { setTNMCNO(e.target.value); }}
                          />
                        </div>
                      </Form.Field>
                    )}

                    {selectedDepartment === "NURSE" && (
                      <Form.Field>
                        <label className="mx-3 form-label">
                          <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>RnrNo</div>
                        </label>
                        <div className="col-sm-7">
                          <input 
                            className="mx-4 form-control"
                            type="text"
                            placeholder="Enter your RnrNo"
                            ref={register("RNRNO")}
                            required
                            autoComplete="off"
                            onChange={e => { setRNRNO(e.target.value); }}
                          />
                        </div>
                      </Form.Field>
                    )}

                    {selectedDepartment === "NURSE" && (
                      <Form.Field>
                        <label className="mx-3 form-label">
                          <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>ValidlityDate</div>
                        </label>
                        <div className="col-sm-7">
                          <input 
                            className="mx-4 form-control"
                            type="text"
                            placeholder="Enter your ValidlityDate"
                            ref={register("ValidlityDate")}
                            required
                            autoComplete="off"
                            onChange={e => { setValidlityDate(e.target.value); }}
                          />
                        </div>
                      </Form.Field>
                    )}

                       <div className="col-md-3">
                        <input 
                        className=" mx-4 form-control"
                        type="text"
                        value={designation}
                        placeholder="Designation"
                       ref={register("designation", { pattern: /^[a-zA-Z]*$/ })}
                       required
                       autoComplete="off"
                       onChange={e => { setDesignation(e.target.value); validateDesignation(e.target.value); }}
                     />
                     <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateDesignation(designation) ? <p>{validateDesignation(designation)}</p> : null}</div>
                    </div>  


                    <div className="col-md-3">
                    <input
                     className=" mx-4 form-control"
                    placeholder="Date of Joining"
                    onClick={() => document.getElementById('dateofjoining-picker').click()}
                    value={dateofjoining ? moment(dateofjoining).format('YYYY-MM-DD') : ''}
                    />
                    <DatePicker
                      id="dateofjoining-picker"
                      selected={dateofjoining}
                        onChange={handleDateofjoiningChange}
                        dateFormat="yyyy-MM-dd"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="d-none"
                    />
                    </div>
  </div>  

     <br/>

   <div className="row">
                       <div className="col-md-3">   
                       <input 
                        className="form-control"
                        type="text"
                        value={salary}
                        placeholder="Salary(CTC)"
                        ref={register("salary", { pattern: /^\d+$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setSalary(e.target.value); validateSalary(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateSalary(salary) ? <p>{validateSalary(salary)}</p> : null}</div>
                      </div>

                      <div className="col-md-3">  
                        <input
                        className="mx-4 form-control"
                        type="text"
                        value={PF}
                        placeholder="UAN/PF"
                        onChange={(e) => setPF(e.target.value)} // Update PF state
                        required
                        autoComplete="off"
                      />
                    <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validatePF(PF) ? <p>{validatePF(PF)}</p> : null}</div>
                    </div>

                    
                    <div className="col-md-3">
                        <label htmlFor="form11" className="bi bi-plus fa-lg" style={{
                              fontFamily:"serif",
                              color: "skyblue",
                              cursor: "pointer",
                              marginLeft: "30%" // Adjust the value as needed
                            }}>Form11
                        </label>
                            <input
                              id="form11"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              multiple
                              hidden
                              name="uploadFile"
                            />
                              {uploadFile && (
                                  <>
                                    <span className="mx-3">{uploadFile.name}</span>
                                    <button className="btn btn-danger" onClick={handleRemoveFile2}>
                                      <i className="fa fa-times"></i>
                                    </button>
                                  </>
                                )}
                        
                      </div>

                      <div className="col-md-3">
                      <input
                       className="mx-4 form-control"
                      type="text"
                      value={ESINO}
                      placeholder="ESINO"
                      onChange={(e) => setESINO(e.target.value)} // Update ESINO state
                      required
                      autoComplete="off"
                    />
                    <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateESINO(ESINO) ? <p>{validateESINO(ESINO)}</p> : null}</div>
                      </div>
                     
 </div>
<br/>

 <div className="row">
                          <div className="col-md-3">
                            <input
                             className="form-control"
                              type="text"
                              id="reportedBy"
                              value={reportedBy}
                              onChange={handleReportedByChange}
                              placeholder="Reported To"
                            />
                          </div>

                          <div className="col-md-3">
                          <input
                           className="mx-4 form-control"
                              type="text"
                              id="medicalClaimPolicyNo"
                              placeholder="Medical Claim Policy No"
                              value={medicalClaimPolicyNo}
                              onChange={handleMedicalClaimPolicyNoChange}
                            />
                          </div>

                         
                          
                            <div className="col-md-3"> 
                              <DatePicker
                                selected={validityDateFrom}
                                onChange={handleFromDateChange}
                                dateFormat="MM/dd/yyyy"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Validity Date From"
                                className="mx-4 small-text-input"
                              />
                              </div>
                              <div className="col-md-3">
                              <DatePicker
                                selected={validityDateTo}
                                onChange={handleToDateChange}
                                dateFormat="MM/dd/yyyy"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Validity Date To"
                                className="mx-4 small-text-input" 
                                
                              />
                            </div>
                     
 </div>
<br/>
 <div className="row">
                            <div className="col-md-3">
                            <select
                             className="form-control"
                              id="employmentCategory"
                              name="employmentCategory"
                              value={employmentCategory}
                              onChange={handleCategoryChange}
                            >
                              <option value="" disabled>Select an employment category</option>
                              <option value="Consultant">Consultant</option>
                              <option value="Onroll">Onroll</option>
                            </select>
                            </div>


                            <div className="col-md-3">
                            <select
                              className=" mx-4 form-control"
                              id="employeeType"
                              name="employeeType"
                              value={employeeType}
                              onChange={handleEmployeeTypeChange}
                            >
                              <option value="" disabled>Select a type of employee</option>
                              <option value="Full Time">Full Time</option>
                              <option value="Part Time">Part Time</option>
                              <option value="Contract">Contract</option>
                            </select>
                            </div>
 </div>

                            <br/>    
                            <center>
                            <h4 style={{ fontFamily: 'serif' }}>Asset Details</h4>
                          </center>
                            <br/>    

                          
        <table className="table table-bordered">
        <thead>
          <tr align="center">
            <th>SL.No</th>
            <th >Description</th>
            <th >Model/Serial No</th>
          </tr>
        </thead>
        <tbody>
          {assetDetails.map((row, index) => (
            <tr key={index}>
              <td>{row.slNo}</td>
              <td
                contentEditable
                onBlur={(e) => handleAssetContentEditableChange(index, 'description', e.target.textContent)}
              >
                {row.description}
              </td>
              <td
                contentEditable
                onBlur={(e) => handleAssetContentEditableChange(index, 'modelSerialNo', e.target.textContent)}
              >
                {row.modelSerialNo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => addRow('asset')} className="btn btn-primary">Add Row</button>
      </div>

  </Form>
            ),
          },
      {
        title: "Preview",
          content:(
            <Form onSubmit={handleSubmit(onSubmit)}>
           
      <button
        className="button-71 Add-employee-button"
        role="button"
        type="submit"
        onClick={handleCombinedClick} // Use the combined handler for the button click
      >
        ADD EMPLOYEE
      </button>
      <p>{message}</p> 
      {uploadSuccess && <p>Upload successful!</p>}
 
    
       </Form>
           )
   
      },
      
 ]
  return (
    <body className="addemp">      
    <div className="App">
   <HorizontalTabs tabs={tabs} />
    </div>
   
       </body>
  );
}
export default Addemp;