"use client";

const Github = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 
    0-.28-.01-1.02-.02-2-3.34.72-4.04-1.6-4.04-1.6-.54-1.36-1.32-1.72-1.32-1.72
    -1.08-.74.08-.72.08-.72 1.2.08 1.84 1.24 1.84 1.24 1.06 1.82 2.78 1.3 
    3.46 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.34-5.46-5.96 
    0-1.32.46-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.18 
    0 0 1-.32 3.3 1.24a11.4 11.4 0 0 1 6 0C17.2 5.1 18.2 5.42 
    18.2 5.42c.66 1.66.24 2.88.12 3.18.78.84 1.24 1.92 
    1.24 3.24 0 4.64-2.8 5.66-5.48 5.96.44.38.82 1.12.82 
    2.26 0 1.64-.02 2.96-.02 3.36 0 .32.22.7.82.58A12.01 
    12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import {
	
	BookOpen,
	Settings,
	Moon,
	Sun,
	LogOut,
	Star,
	Crown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import Logout from "@/modules/auth/components/logout-ui";
import { useSession } from "@/lib/auth-client";

export const AppSidebar = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	const navigationItems = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: BookOpen,
		},
		{
			title: "Repository",
			url: "/dashboard/repository",
			icon: Github,
		},
		{
			title: "Reviews",
			url: "/dashboard/reviews",
			icon: Star,
		},
		{
			title: "Subscriptions",
			url: "/dashboard/subscriptions",
			icon: Crown,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings,
		},
	];

	const isActive = (url: string) => {
		return pathname === url || pathname.startsWith(url + "/dashboard");
	};

	if (!mounted || !session) return null;

	const user = session.user;
	const userName = user.name || "GUEST";
	const userEmail = user.email || "";
	const userAvatar = user.image || "";
	const userInitials = userName
		.split(" ")
		.map((s) => s[0])
		.join("")
		.toUpperCase();

	return (
		<Sidebar>
			<SidebarHeader className="border-b">
				<div className="flex flex-col gap-4 px-2 py-6">
					<div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors">
						<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground shrink-0">
							<Github className="w-6 h-6" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-semibold text-sidebar-foreground tracking-wide">
								Connected Account
							</p>
							<p className="text-sm font-medium text-sidebar-foreground/90 truncate">
								@{userName}
							</p>
						</div>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-3 py-6 flex-col gap-1">
				<div className="mb-2">
					<p className="text-xs font-semibold text-sidebar-foreground/60 px-3 mb-3 uppercase tracking-widest">
						Menu
					</p>
				</div>

				<SidebarMenu className="gap-2">
					{navigationItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={`h-11 px-4 rounded-lg transition-all duration-200 ${
									isActive(item.url)
										? "bg-primary/90 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-semibold"
										: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground"
								}`}
							>
								<Link
									href={item.url}
									className="flex items-center gap-3"
								>
									<item.icon className="w-5 h-5 flex shrink-0" />
									<span className="text-sm font-medium">
										{item.title}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t px-3 py-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size={"lg"}
									className="h-12 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground 
hover:bg-sidebar-accent/50 transition-colors"
								>
									<Avatar className="w-10 h-10 rounded-lg shrink-0">
										<AvatarImage
											src={
												userAvatar || "/placeholder.svg"
											}
											alt={userName}
										/>
										<AvatarFallback className="rounded-lg">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-relaxed min-w-0">
										<span className="truncate font-semibold text-base">
											{userName}
										</span>
										<span className="truncate text-xs text-sidebar-foreground/70">
											{userEmail}
										</span>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								className="w-80 rounded-lg"
								align="end"
								side="right"
								sideOffset={8}
							>
								<div className="flex items-center gap-3 px-4 py-4 bg-sidebar-accent/30 rounded-t-lg">
									<Avatar className="w-12 h-12 rounded-lg shrink-0">
										<AvatarImage
											src={
												userAvatar || "/placeholder.svg"
											}
											alt={userName}
										/>
										<AvatarFallback className="rounded-lg">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm">
											{userName}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{userEmail}
										</p>
									</div>
								</div>

								<div className="px-2 py-3 border-t border-b">
									<DropdownMenuItem asChild>
										<button
											onClick={() =>
												setTheme(
													theme === "dark"
														? "light"
														: "dark"
												)
											}
											className="w-full px-3 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-sidebar-accent/50 transition-colors text-sm font-medium"
										>
											{theme === "dark" ? (
												<>
													<Sun className="w-5 h-5 shrink-0" />
													<span>Light Mode</span>
												</>
											) : (
												<>
													<Moon className="w-5 h-5 shrink-0" />
													<span>Dark Mode</span>
												</>
											)}
										</button>
									</DropdownMenuItem>
									<DropdownMenuItem className="cursor-pointer px-3 py-3 my-1 rounded-md hover:bg-red-500/10 hover:text-red-600 transition-colors font-medium">
										<LogOut className="w-5 h-5 mr-3 shrink-0" />
										<Logout>
											Sign Out
										</Logout>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};