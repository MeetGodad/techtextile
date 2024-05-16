

export default function Login() {
    return (
      <div className="flex w-full h-full">
        <div className=" flex w-2/4 relative bg-white h-[1024px] overflow-hidden text-left text-mini text-black font-poppins">

        <div className="absolute top-[150px] left-[650px]  tracking-[-0.02em] leading-[140%] font-semibold text-[3rem] inline-block ">
          LOG
        </div>
        
        
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[562px] left-[240px] w-[242px] h-[75px]">
          <div className="absolute top-[0px] left-[0px] rounded-[15px] bg-black box-border w-[242px] h-[75px] border-[1px] border-solid border-black" />
          <div className="absolute top-[19px] left-[55px] text-2xl tracking-[-0.02em] leading-[140%] font-poppins text-white text-left inline-block w-[120px] h-[37px]">
            CONTINUE
          </div>
        </button>
        <div className="absolute top-[467px] left-[214px] w-[275px] h-[60px]">
          <input
            className="[outline:none] bg-[transparent] absolute top-[22px] left-[0px] rounded-8xs box-border w-[275px] h-[38px] border-[1px] border-solid border-black"
            type="text"
          />
          <div className="absolute top-[0px] left-[0px] tracking-[-0.02em] leading-[140%] font-semibold inline-block w-[155px] h-[22px]">
            PASSWORD
          </div>
        </div>
        <div className="absolute top-[353px] left-[214px] w-[275px] h-[60px]">
          <input
            className="[outline:none] bg-[transparent] absolute top-[22px] left-[0px] rounded-8xs box-border w-[275px] h-[38px] border-[1px] border-solid border-black"
            type="text"
          />
          <div className="absolute top-[0px] left-[0px] tracking-[-0.02em] leading-[140%] font-semibold inline-block w-[155px] h-[22px]">
            EMAIL
          </div>
        </div>
        <div className="absolute top-[239px] left-[214px] w-[275px] h-[60px]">
        <select
          className="[outline:none] bg-[transparent] absolute top-[22px] left-[2px] rounded-8xs box-border w-[275px] h-[38px] border-[1px] border-solid border-black"
        >
          <option value="">Select an option</option>
          <option value="buyer">As a Buyer </option>
          <option value="Seller">As a Seller</option>
        </select>
          <h3 className="absolute top-[0px] left-[0px] tracking-[-0.02em] leading-[140%] font-semibold inline-block w-[155px] h-[22px]">
            INTERESTED AS
          </h3>
        </div>
        <a className="[text-decoration:none] absolute top-[702px] left-[221px] text-2xl font-inter text-[inherit] inline-block w-[295px] h-[42px]">
          Don’t have the account?
        </a>
      </div>
      <div className=" flex w-2/4 relative bg-black h-[1024px] overflow-hidden text-left text-mini text-black font-poppins">
      <div className="absolute top-[150px] left-[10px] text-16xl tracking-[-0.02em] leading-[140%] font-semibold text-white inline-block text-[3rem]">
          IN
        </div>
        <img src="Images/LOGO.png" className="absolute m-auto self-center left-1/4  w-[500px] h-[500px]" />
      </div>
      </div>
    );
  };