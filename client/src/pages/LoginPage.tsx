import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import{useNavigate,Link}from 'react-router-dom'
import logo from "../assets/logo.png"

interface IFormInput {
  email: string;
  password: string;
}



export function LoginPage( ) {
 const { loginUser } = useAuth();
   const navigate=useNavigate()

  const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm<IFormInput>();
  
  const  onSubmit : SubmitHandler<IFormInput>= async (data ) => {
    const { email, password } = data;
    clearErrors("root");
    try {
      const result = await login(email, password);

      loginUser(result.token,result.user);
      navigate('/groups')
      reset();
    } catch (error) {
      setError("root", {
        type: "server",
        message: error instanceof TypeError
          ? "לא ניתן להתחבר לשרת. בדקי את החיבור לאינטרנט ונסי שוב."
          : error instanceof Error
            ? error.message
            : "אירעה שגיאה בהתחברות. נסי שוב.",
      });
    }
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
          ברוכה הבאה
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          התחברי לחשבון שלך כדי להמשיך
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
</div>
        {errors.root?.message && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {errors.root.message}
          </p>
        )}
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
  התחברות
</button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
  אין לך חשבון?{" "}
  <Link
    to="/register"
    className="font-semibold text-brand-teal hover:underline"
  >
    הרשמי
  </Link>
</p>
    </div>
  </div>
)
}
