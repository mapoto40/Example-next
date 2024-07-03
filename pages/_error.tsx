import { GetServerSidePropsContext } from "next";

const Page = () => {
    return (
        <>
            <div style={{height: "75vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <h1><span style={{fontSize: "1.5em"}}>404 -</span> OUPS ! LA PAGE QUE VOUS RECHERCHEZ N'EXISTE PAS.</h1>
            </div>
        </>
    );
}
export default Page;