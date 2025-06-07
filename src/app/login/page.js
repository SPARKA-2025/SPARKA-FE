'use client'
// import Navbar from "@components/Navbar";
// import SearchBar from "@components/Searchbar";
// import Card from "@components/Card";
import { Box, Button, FormLabel, TextField } from "@mui/material";
// import loginAction from "../lib/action/loginAdminAction";

export default function Home() {

  return (
    <main className="bg-[#FFD602] h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
      <LoginForm />
    </main>
  );
}

function LoginForm() {
      return (
          <Box
            component={"form"}
            // action={loginAction}
            className="flex-col flex w-[84%] mx-[8%] justify-around h-[72%] bottom-0 fixed rounded-t-[48px] px-[4%] bg-white-smoke"
          >
            <span className=" text-3xl font-semibold text-primary mt-2 -mb-8">
              Masuk
            </span>
            <div>
              <FormLabel className="text-lg font-semibold text-primary">
                Email
              </FormLabel>
              <TextField
                id="email"
                name="email"
                variant="outlined"
                className="w-full shadow-lg "
                color="primary"
                required
              />
            </div>
            <div>
              <FormLabel className=" text-lg font-semibold text-primary">
                Password
              </FormLabel>
              <TextField
                id="password"
                name="password"
                className="w-full shadow-lg "
                color="primary"
                required
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              className="bg-primary w-full h-[8%] mb-[10%]"
              type="submit"
              // href={"/transaksi/detail/id"}
            >
              Simpan
            </Button>
          </Box>
      );
    }
  