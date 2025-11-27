import {useState, useEffect} from "react";
//import { useSelector } from "react-redux";
//import "./css/video.css";
import { FaUpDown, FaUpload } from "react-icons/fa6";
import axios from "../../../api/axios";
import { Link } from "react-router-dom";
import { PRODUCT_URL, PRODUCT_CATEGORY_URL, USERS_URL, SUPPLIER_URL } from "../../../routes/serverRoutes";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";

const AdminCreateProduct = ({onClick}) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory]  = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const token = useSelector(selectCurrentToken);
  const [fileDataURL, setFileDataURL]= useState(null);
  const {activeMenu, screenSize, setActiveMenu} = useStateContext();

  const [showFiles, setShowFiles] = useState(false);

  const [showTypeOne, setShowTypeOne] = useState(false);
  const [showTypeTwo, setShowTypeTwo] = useState(false);

  const [hasUpload, setHasUpload] = useState(false);
  const [runFunc, setRunFunc] = useState(false);

  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);

  const [validPhoto, setValidPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [validAudio, setValidAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const [errPhoto, setErrPhoto] = useState("");
  const [errAudio ,setErrAudio] = useState("");

  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUplaoding] = useState(false);

  const [photo, setPhoto] = useState();
  const [errMsg, setErrMsg] = useState();
  const [photoX, setPhotoX] = useState(null);
  const [Hi, setHi] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState();
  const [fileNames, setFileNames] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const [supplier, setSupplier] = useState("");
  // GET GENRES


  useEffect(() => {
    const getRooms = async () => {
      const res = await axios.get(PRODUCT_CATEGORY_URL, { headers: {Authorization: `Bearer ${token}`}, withCredentials: true});
      setCategories(res?.data);
      console.log(categories);
      if(res?.data.length > 0) 
       setCategory(res.data[0].id);
      else  setCategory(null);
    }
    getRooms();
  }, [])

    useEffect(() => {
        const getSuppliers = async () => {
            try {
            const res = await axios.get(SUPPLIER_URL, {headers: {Authorization: `Bearer ${token}`}, withCredentials: true});
            console.log(res?.data);
            setSuppliers(res?.data);
            setSupplier(res?.data[0].id);
            }catch(err) {
                setErrMsg(err?.response?.data?.error);
            }
        }
        getSuppliers();
    }, [])


  // PREVIEW PHOTO
  useEffect(() => {
    let fileReader, isCancel = false;
    //console.log("photo: ", files);
    if(photoX) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
            const {result} = e.target;
            if(result && !isCancel) {
                setFileDataURL(result);
            }
        }

        fileReader.readAsDataURL(photoX);
    }
    //console.log(fileDataURL);
    return () => {
      isCancel = true;
      if(fileReader && fileReader.readyState == 1) {
        fileReader.abort();
      }
    }

  }, [photoX])

  const onChangeCategory = (e) => setCategory(e.target.value);

  useEffect(() => {
    setShowUploadProgress((showUploadProgressx) => showUploadProgressx)
  }, [showUploadProgress])


  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      for(let i=0;i<files.length; i++) {
        formData.append("files", files[i])
      }

      formData.append("productCategory", category);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("files", files);
      formData.append("weight", weight);
      formData.append("height", height);
      formData.append("width", width);
      formData.append("length", length);
      formData.append("productCategoryName", productCategoryName);
      formData.append("supplierId", supplier);
      console.log(formData);
     
        // const postLyric = null
    const postProduct = await axios.post(`${PRODUCT_URL}/create`, formData,
        {headers:{ "Content-Type": "multipart/form-data"}, 
            onUploadProgress: (progressEvent) => {
              const {loaded, total} = progressEvent;
              let percentage = Math.floor((loaded*100)/total);
              //console.log(percentage)
            setProgress1(percentage);
            setIsUplaoding(true);
        }});
    console.log(postProduct);

    // Send the product data back to the parent (AdminAddStock)
    const createdProduct = postProduct?.data;  // assuming the post response contains the product data
      if (createdProduct) {
        setSuccess("Product created successfully!");
        onClick(createdProduct);  // Passing the product data back to the parent component
      }
    window.scrollTo(0, 50);
    if(isUploading) {
        console.log("progress1: ", progress1);
        setShowUploadProgress(true);
    }
 
    }      
    catch(err) {
      console.log(err);
      setErrMsg(err?.response?.data?.error);
      setTimeout(()=> {
        setErrMsg(false);
      }, [2000])
    }
  }

  const handleCategory = (e) => {
    setCategory(e.target.value);
    console.log(e.target.value);
    let arr = categories.filter(category => category.id ==e.target.value);
    setProductCategoryName(arr[0].name);
    console.log(arr, productCategoryName);
  }

  const handleSupplier = (e) => {
    setSupplier(e.target.value);
    console.log(supplier);
  }

  const handlePhotoUpload = (e) => {
    //const filename = e.target.files[0].name;
    /*console.log(e.target.files);
    const validExtensions = ['jpg', 'png']
    let splittedFilename = filename.split(".");
    let fileExtension = splittedFilename[splittedFilename.length-1];

    if(validExtensions.includes(fileExtension)) {
      setValidPhoto(true);
      setPhotoX(e.target.files[0]);
    }
   
      else {
      setPhotoError('Image file extension not of correct type, \nonly png & jpg files are allowed!');
      setTimeout(() => {
        setPhotoError(false);
      }, [5000])
    }   */
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files); // Ensure files are converted to an array
            const fileNamesArray = filesArray.map((file) => file.name);
            console.log(filesArray);
            setFileNames(fileNamesArray);
            setFiles(e.target.files);
        }
  }
console.log(fileNames)
console.log(screenSize, activeMenu);
  return (
    <>
    <section className={`  -z-50 md:ml-[19%] px-1`}>
      <div className=" my-2 mt-1 ">
        <h1 className="text-2xl text-center ">Manager DashBoard | Product-Stock</h1>
      </div>
   
      {/** Get videos to post */}
      <div className=" p-2 mx-1 my-2 bg-gradient-to-r from-[rgba(0,120,120,0.1)] to-[rgba(0,100,150,0.3)] "
           >
            {Hi ? null : null}      
            {errMsg ? <div className="font-serif text-xl text-red-800 font-semibold"><h1>{errMsg}</h1></div> : null}
            {success ? <div className=" animate-bounce font-serif text-xl text-teal-800 font-semibold"><h1>{success}</h1></div> : null}
             
          <div className={ fileDataURL ? " absolute ml-[45vw] top-[30vh] md:ml-[25vw] " : "relative my-2 w-[25%] md:w-[22%]" }>
            
            <div className=" w-[100%] grid grid-cols-2 gap-[30vh] py-1 rounded-lg pr-3 hover:bg-indigo-200">
              <div>
                <p  className=" text-xl inline-flex text-teal-800 ml-2 font-semibold mb-2 md:text-lg ">Select</p>
                <label className=" cursor-pointer" htmlFor='photo'>
                  <FaUpload className=" ml-7 h-7 w-11"/>
                  <p className=" font-serif font-semibold text-purple-900 text-lg mx-6 ">Upload</p>
                </label>
                <input type='file' accept="image/*" multiple id="photo" onChange={handlePhotoUpload} hidden/>
              </div>

              <div>
                <p>Selected File Names:</p>
                <ul>
                    {fileNames ? fileNames.map((name, index) => (
                        <li key={index}> {name} ready for upload</li>
                    )) : null}
                </ul>
              </div>

            </div> 
        </div>

        <div className="my-3 text-lg ">
          <label htmlFor='category'>Category</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={category} onChange={handleCategory}
          > 
            {categories ? categories.map(category => {
              return (<option className=" rounded-lg font-sans m-3" key={category.id} value={category.id}>{category.name}</option>)
            }) : null}
          </select>
        </div>
        <div className="my-3 text-lg ">
          <label htmlFor='category'>Supplier</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={supplier} onChange={handleSupplier}
          > 
            {suppliers ? suppliers.map(supplier => {
              return (<option className=" rounded-lg font-sans m-3" key={supplier.id} value={supplier.id}> {supplier.id} {supplier.name}</option>)
            }) : null}
          </select>
        </div>
        <div className="my-2 md:my-3 ">
            <label htmlFor="title">Name</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="text" value={name} 
             onChange={e=> setName(e.target.value)}  
            />
        </div>
        <div className="my-2 my:py-3">
            <label>Price</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="number" value={price} min={1} max={100} onChange={e=>setPrice(e.target.value)}/>
        </div>

        <div className="flex w-[80%] space-x-12">

          <div className="my-2 my:py-3">
            <label>Length</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="number" value={length} min={1} max={100} onChange={e=>setLength(e.target.value)}/>
        </div>
          <div className="my-2 my:py-3">
            <label>Width</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="number" value={width} min={1} max={100} onChange={e=>setWidth(e.target.value)}/>
        </div>
          <div className="my-2 my:py-3">
            <label>Height</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="number" value={height} min={1} max={100} onChange={e=>setHeight(e.target.value)}/>
        </div>
          <div className="my-2 my:py-3">
            <label>Weight</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="number" value={weight} min={1} max={100} onChange={e=>setWeight(e.target.value)}/>
        </div>
        </div>

        <div className="text-lg">
            <label htmlFor="text">Description</label>
            <textarea id="text" placeholder="Add text..." 
              className=" h-40 w-[80%] rounded-md py-2 md:py-3 shadow p-2
            focus:outline-[0.16rem] outline-sky-300 block " type="text"
             value={description} onChange={e=>setDescription(e.target.value)}>
            </textarea>
        </div>

        <div onClick={(e) => handlePostSubmit(e)} className="w-48 my-2 md:my-1 ">
          <button className=" p-2 w-40 text-lg animation delay-150 duration-300 
            border rounded-md shadow-sm bg-indigo-100 hover:bg-indigo-300 cursor-pointer 
            hover:translate-y-[2px]" 
            type="submit">Post
          </button>
        </div>

    </div>   

    </section>
    
    </>
  )
}

export default AdminCreateProduct