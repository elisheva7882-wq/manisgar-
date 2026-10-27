import { useForm, type SubmitHandler } from "react-hook-form";
import { registerApi } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import{Link, useNavigate}from 'react-router-dom'
import logo from "../assets/logo.png"


interface IFormInput {
 fullName:string;
  email: string;
  password: string;
}



export function RegisterPage( ) {
 const { loginUser } = useAuth();
  const { register, handleSubmit, formState: { errors } ,reset} = useForm<IFormInput>();
   const navigate=useNavigate()
  const  onSubmit : SubmitHandler<IFormInput>= async (data ) => {
    const { fullName,email, password } = data;
    const result = await registerApi(fullName,email, password);
   
    loginUser(result.token,result.user);
     navigate('/groups')
    reset();
  }


return (
  <div
    dir="rtl"
    className="
      flex min-h-screen
      items-center justify-center
      bg-brand-pink/20
      px-4 py-10
    "
  >
    <div
      className="
        w-full max-w-md
        rounded-3xl
        border border-brand-teal/10
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-7 text-center">
        <img
          src={logo}
          alt="מה נסגר?"
          className="mx-auto mb-5 w-44"
        />

        <h1 className="text-2xl font-bold text-brand-teal">
          יצירת חשבון
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          הרשמי כדי להצטרף ולהתחיל
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="space-y-4">
  <input
    {...register("fullName", { required: true })}
    placeholder="שם מלא"
    type="text"
    className="
      h-11 w-full
      rounded-xl
      border border-brand-teal/20
      px-4
      outline-none
      transition
      placeholder:text-muted-foreground
      focus:border-brand-teal/50
      focus:ring-2
      focus:ring-brand-teal/10
    "
  />

  {errors.fullName && (
    <p className="mt-1 text-sm text-red-500">
      שם הוא שדה חובה
    </p>
  )}
</div>

        {errors.fullName && (
          <span style={{ color: "red" }}>
            שם הוא שדה חובה
          </span>
        )}

        <br />

     <div>
  <input
    {...register("email", { required: true })}
    placeholder="אימייל"
    type="email"
    className="
      h-11 w-full
      rounded-xl
      border border-brand-teal/20
      px-4
      outline-none
      transition
      placeholder:text-muted-foreground
      focus:border-brand-teal/50
      focus:ring-2
      focus:ring-brand-teal/10
    "
  />

  {errors.email && (
    <p className="mt-1 text-sm text-red-500">
      דוא"ל הוא שדה חובה
    </p>
  )}
</div>

        {errors.email && (
          <span style={{ color: "red" }}>
            דוא"ל הוא שדה חובה
          </span>
        )}

        <br />

      <div>
  <input
    {...register("password", { required: true })}
    placeholder="סיסמה"
    type="password"
    className="
      h-11 w-full
      rounded-xl
      border border-brand-teal/20
      px-4
      outline-none
      transition
      placeholder:text-muted-foreground
      focus:border-brand-teal/50
      focus:ring-2
      focus:ring-brand-teal/10
    "
  />

  {errors.password && (
    <p className="mt-1 text-sm text-red-500">
      סיסמה היא שדה חובה
    </p>
  )}
</div>

        {errors.password && (
          <span style={{ color: "red" }}>
            סיסמה היא שדה חובה
          </span>
        )}
</div>
        <br />

      <button
  type="submit"
  className="
    mt-5 h-11 w-full
    rounded-xl
    bg-brand-teal
    font-semibold
    text-white
    transition
    hover:bg-brand-teal/90
  "
>
  הרשמה
</button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
  כבר יש לך חשבון?{" "}
  <Link
    to="/login"
    className="font-semibold text-brand-teal hover:underline"
  >
    התחברי
  </Link>
</p>
    </div>
  </div>
)
}