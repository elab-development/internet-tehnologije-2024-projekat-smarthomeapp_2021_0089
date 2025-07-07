import { List } from "@chakra-ui/react"

import { NavLink } from "react-router-dom"
import { FaCalendarAlt, FaPenAlt, FaUserAlt, FaHome } from "react-icons/fa";

export default function SideBar() {
  return (
        <List.Root color="white" fontSize="1.2em" spacing={4} listStyleType="none">
            <List.Item>
                <NavLink to="/main/dashboard">
                    <List.Indicator as={FaCalendarAlt} color="white" />
                    Dashboard
                </NavLink>
            </List.Item>
            <List.Item>
                <NavLink to="/main/devices">
                    <List.Indicator as={FaHome} color="white" />
                    My Devices
                </NavLink>
            </List.Item>
            <List.Item>
                <NavLink to="/main/create">
                    <List.Indicator as={FaPenAlt} color="white" />
                    New Device
                </NavLink>
            </List.Item>
            <List.Item>
                <NavLink to="/main/profile">
                    <List.Indicator as={FaUserAlt} color="white" />
                    Profile
                </NavLink>
            </List.Item>
        </List.Root>
    );
}
