import { Key, ReactElement } from "react";
import css from './userButton.module.css';
import { User } from "@/types";
import { Dropdown, Text } from "@nextui-org/react";
import Swal from "sweetalert2";
import Router from "next/router";
import { api } from "@/config/apiConfig";
import ImageIcon from "@/components/common/imageIcon";

async function signout() {
    Swal.fire({
        title: "Do you want to sign out?",
        confirmButtonColor: "#dc3741",
        confirmButtonText: 'Sign out',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete("/api/auth");
                Router.push("/");
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Sign out error",
                    text: `${error}`
                });
            }
        }
    });
};

function dropDownHandler(key: Key) {
    if (key == "settings") {
        Router.push("/profile");
    } else if (key == "change-password") {
        Router.push("/auth/change-password");
    } else if (key == "help_and_feedback") {
        Router.push("/help");
    } else if (key == "signout") {
        signout();
    }
}

export default function UserButton({
    user
}: {
    user: User
}): ReactElement {
    return (
        <Dropdown placement="bottom-left">
            <Dropdown.Trigger>
                <div
                    id="user button"
                    className={css.imageIcon}>
                    <ImageIcon user={user}/>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Menu color="primary" aria-label="User Actions" disabledKeys={["profile"]} onAction={dropDownHandler}>
                <Dropdown.Item key="profile" css={{ height: "$18", color: "black" }}>
                    <Text b color="inherit" css={{ d: "flex" }}>
                        Signed in as
                    </Text>
                    <Text b color="inherit" css={{ d: "flex" }}>
                        { user.email }
                    </Text>
                </Dropdown.Item>
                <Dropdown.Item key="settings" withDivider>
                    <span>Your profile</span>
                </Dropdown.Item>
                <Dropdown.Item key="change-password" withDivider>
                    <span>Change password</span>
                </Dropdown.Item>
                {/* <Dropdown.Item key="help_and_feedback" withDivider>
                    <span>Help & Feedback</span>
                </Dropdown.Item> */}
                <Dropdown.Item
                    key="signout"
                    color="error"
                    withDivider>
                    <span>Sign out</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}