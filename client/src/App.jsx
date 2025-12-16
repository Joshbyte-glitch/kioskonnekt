import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { Menu } from "@/pages/Menu";
import { FAQs } from "@/pages/FAQs";
import { Directory } from "@/pages/Directory";
import { Announcements } from "@/pages/Announcements";
import { SchoolCalendar } from "@/pages/SchoolCalendar";
import { SubmitInquiry } from "@/pages/SubmitInquiry";
function Router() {
    return (<Switch>
      <Route path="/" component={Home}/>
      <Route path="/menu" component={Menu}/>
      <Route path="/menu/" component={Menu}/> 
      <Route path="/faqs" component={FAQs}/>
      <Route path="/directory" component={Directory}/>
      <Route path="/announcements" component={Announcements}/>
      <Route path="/calendar" component={SchoolCalendar}/>
      <Route path="/inquiry" component={SubmitInquiry}/>
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
