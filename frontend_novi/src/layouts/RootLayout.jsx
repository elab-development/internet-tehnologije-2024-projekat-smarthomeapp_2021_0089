import { Grid, GridItem } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

// components
import NavBar from "../components/NavBar.jsx"
import SideBar from "../components/SideBar.jsx"

export default function RootLayout() {
  return (
    <Grid templateColumns="repeat(8, 1fr)" bg="gray.50">
      {/* sidebar */}
      <GridItem
        as="aside"
        colSpan={{ base: 8, lg: 2, xl: 1 }} //sidebar menja br kolona koji zauzima u zavisnosti od velicine ekrana(base je telefon)
        minHeight={{ lg: '100vh' }} //citava duzina ekrana kada je veliki ekran, u suprotnom je u skladu sa elementima
        p={{ base: '20px', lg: '30px' }}
        bgColor="#A31D1D"
      >
        <SideBar/>
      </GridItem>

      {/* main content & navbar */}
      <GridItem
        as="main"
        colSpan={{ base: 8, lg: 6, xl: 7 }} 
        p="30px"
      >
        <NavBar />
        <Outlet />
      </GridItem>
    </Grid>
  )
}