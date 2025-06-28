import cSharp from "../Images/Cert_CSharp.png";
import javaScript from "../Images/Cert_Js.png";

const Certs = () => {
  return (
    <>
      <div className="cert">
        <img src={javaScript} alt="JavaScript Certifikát" />
      </div>
      <div className="cert">
        <img src={cSharp} alt="C# Certifikát" />
      </div>
    </>
  );
};

export default Certs;
