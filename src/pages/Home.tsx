import { useEffect, useState } from "react"
import { BatteryCharging, History, Speech } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { WavyBackground } from "@/components/ui/wavy-background"
import { companyLogos } from "@/data/dataUI"
import { HeadphonesIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ceoAvatar from '@/assets/ceoAvatar.png'
import { useTheme } from "@/components/darkmode/theme-provider"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { countries } from "@/data/dataUI"
import api from "@/api/configs/axiosConfigs"

const featuresSection = [
    {
        title: "Lightning Fast Setup",
        description: "Create and deploy your AI voice agents in under 60 seconds with our intuitive interface.",
        icon: <BatteryCharging color="white" size={30} />
    },
    {
        title: "24/7 Availability",
        description: "Your AI agents are always ready to handle calls, ensuring you never miss an opportunity.",
        icon: <History color="white" size={30} />
    },
    {
        title: "Human-like Interactions",
        description: "Advanced AI technology ensures natural, engaging conversations with your customers.",
        icon: <Speech color="white" size={30} />
    }
]






export default function Home() {
    const { theme } = useTheme()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(countries[0])
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [countrySearch, setCountrySearch] = useState("")
    const [showOtp, setShowOtp] = useState(false)
    const [isNumberVerified, setIsNumberVerified] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [verificationCode, setVerificationCode] = useState("")


    async function verifyNumber() {
        try{
            const response = await api.post('/verify', {
                phoneNumber: phoneNumber,
                countryCode: selectedCountry.dialCode
            })

            setShowOtp(true)
            
            alert(response.data.message)
        }catch(error: any){
            console.log({error})
            alert(error.response.data.message)
        }
        
    }

    async function submitOtp() {
        try{
            const response = await api.post('/validate', {
                phoneNumber: `${selectedCountry.dialCode}${phoneNumber}`,
                countryCode: selectedCountry.dialCode,
                verificationCode: verificationCode
            })
            alert(response.data.message)
            localStorage.setItem('phoneNumber', phoneNumber)
            localStorage.setItem('countryCode', selectedCountry.dialCode)
            localStorage.setItem('isNumberVerified', 'true')
            setPhoneNumber("")
            setSelectedCountry(countries[0])
            setCountrySearch("")
            setShowCountryDropdown(false)
            setShowOtp(false)
            setIsNumberVerified(true)
            setIsDialogOpen(false)
        }catch(error: any){
            console.log({error})
            alert(error.response.data.message)
        }

    }

    async function startDemoCall() {
        try{
            const response = await api.post('/outbound', {
                toNumber: `+${localStorage.getItem('countryCode')}${localStorage.getItem('phoneNumber')}`,
            })
            alert(response.data.message)
        }
        catch(error: any){
            console.log({error})
            alert(error.response.data.message)
        }
    }


    useEffect(() => {
        const isNumberVerified = localStorage.getItem('isNumberVerified')
        if(isNumberVerified){
            setIsNumberVerified(true)
        }
    }, [])


    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.dialCode.includes(countrySearch)
    )
    const updatePhoneNumber = (number: string) => {
        setPhoneNumber(number)
    }
    
    return (
        <div className="flex min-h-screen flex-col">
            {/* Navigation */}
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="h-[calc(65vh-4rem)] w-full">
                    <div className="relative flex flex-col space-y-4 text-center py-6 md:py-12 lg:py-18 xl:py-24">
                        {theme == 'light' ? <WavyBackground className="mx-auto" backgroundFill="white" speed="fast">
                            <HeroComp setIsDialogOpen={setIsDialogOpen} isNumberVerified={isNumberVerified} startDemoCall={startDemoCall} />
                        </WavyBackground> : <HeroComp setIsDialogOpen={setIsDialogOpen} isNumberVerified={isNumberVerified} startDemoCall={startDemoCall} />}
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="w-full h-[35vh] py-4 md:py-8 lg:py-12 flex justify-center">
                    <div className="container mx-auto px-4 max-w-[70%]">
                        <p className="text-center text-lg text-gray-500 mb-8">TRUSTED BY</p>
                        <div className="grid grid-cols-6 place-content-center gap-5 flex-wrap justify-center items-center">
                            {companyLogos.map((logo, index) => (
                                <img key={index} src={logo} alt={'Company-logo'} className="opacity-70 h-6 " />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
                    <div className="container px-4 md:px-6 max-w-[80%]">
                        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                            {featuresSection.map(({ title, description, icon }, i) => (
                                <div key={i} className="flex flex-col items-center space-y-4 text-center">
                                    <div className="flex justify-center items-center h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-violet-500" >
                                        {icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{title}</h3>
                                    <p className="text-muted-foreground">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Testimonials */}
                <section className=" py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-8 text-center">What our customers say about us...</h2>
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="p-6">
                                <p className="text-lg mb-4">"The previous IVR handled about 15% of calls. After releasing the AI Voice Agent, it is now handling over 50% of calls."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                                        <img src={ceoAvatar} alt="" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Josh Andrews</p>
                                        <p className="text-sm text-gray-600">CTO at Spare</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Demo Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) {
                        // Reset all state when dialog is closed
                        setPhoneNumber("")
                        setSelectedCountry(countries[0])
                        setCountrySearch("")
                        setShowCountryDropdown(false)
                        setShowOtp(false)
                        setIsNumberVerified(false)
                    }
                }}>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden">
                        <div className="relative">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-2xl font-bold text-white">Try AI Voice Agent</DialogTitle>
                                        <p className="text-blue-100 mt-2 text-sm">
                                            Experience our AI voice agent with a live demo call
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                                        <HeadphonesIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">Select Country</Label>
                                        <div className="relative">
                                            <div 
                                                className="flex items-center gap-3 border-2 border-gray-200 rounded-lg px-4 py-3 cursor-pointer bg-white hover:border-blue-300 transition-all duration-200 shadow-sm"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            >
                                                <span className="text-lg">{selectedCountry.flag}</span>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{selectedCountry.name}</div>
                                                    <div className="text-sm text-gray-500">{selectedCountry.dialCode} • {selectedCountry.code}</div>
                                                </div>
                                                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            
                                            {showCountryDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-blue-200 rounded-lg mt-1 max-h-60 overflow-hidden z-50 shadow-xl">
                                                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                                                        <div className="relative">
                                                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            <Input
                                                                placeholder="Search countries..."
                                                                value={countrySearch}
                                                                onChange={(e) => setCountrySearch(e.target.value)}
                                                                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {filteredCountries.map((country) => (
                                                            <div
                                                                key={country.code}
                                                                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                                                                onClick={() => {
                                                                    setSelectedCountry(country)
                                                                    setShowCountryDropdown(false)
                                                                    setCountrySearch("")
                                                                }}
                                                            >
                                                                <span className="text-lg">{country.flag}</span>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-900">{country.name}</div>
                                                                    <div className="text-sm text-gray-500">{country.dialCode} • {country.code}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                {selectedCountry.dialCode}
                                            </div>
                                            <Input
                                                type="number"
                                                id="phone"
                                                required
                                                placeholder="Enter your phone number"
                                                value={phoneNumber}
                                                onChange={(e) => updatePhoneNumber(e.target.value)}
                                                className="pl-16 border-2 border-gray-200 focus:border-blue-300 focus:ring-blue-300 rounded-lg py-3"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {!showOtp ? (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm text-blue-800">
                                                    <div className="font-medium">Free Demo Call</div>
                                                    <div>We'll send you a verification code to confirm your number</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="flex-1 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                                onClick={() => {
                                                    setIsDialogOpen(false)
                                                    setPhoneNumber("")
                                                    setSelectedCountry(countries[0])
                                                    setCountrySearch("")
                                                    setShowCountryDropdown(false)
                                                    setShowOtp(false)
                                                    setIsNumberVerified(false)
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="button" 
                                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                onClick={() => {
                                                    verifyNumber()
                                                }}
                                                disabled={!phoneNumber.trim()}
                                            >
                                                Verify your number
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm text-green-800">
                                                    <div className="font-medium">Verification Code Sent</div>
                                                    <div>Enter the 6-digit code sent to {selectedCountry.dialCode} ••••••••••</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                                            <Input
                                                id="otp"
                                                required
                                                placeholder="Enter 6-digit code"
                                                className="border-2 border-gray-200 focus:border-blue-300 focus:ring-blue-300 rounded-lg py-3 text-center text-lg font-mono tracking-widest"
                                                maxLength={6}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="flex-1 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                                onClick={() => setShowOtp(false)}
                                            >
                                                Back
                                            </Button>
                                            <Button 
                                                type="button" 
                                                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                onClick={() => {
                                                    submitOtp()
                                                }}
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </main>

        </div>
    )
}



function HeroComp({ setIsDialogOpen, isNumberVerified, startDemoCall }: { setIsDialogOpen: (open: boolean) => void, isNumberVerified: boolean, startDemoCall: () => void }) {
    return (<>
        <div className="space-y-2 ">
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                NEW
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Supercharge your <br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {" "}Call Operations{" "}
                </span>
                with AI voice agents
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Try our demo for free, no credit card required.
                Please Click any number to start a demo call. coz this is a trial.
            </p>
        </div>
        <div className="space-x-4 mt-5">
            <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-violet-600"
                onClick={() => {
                    if(isNumberVerified){
                        startDemoCall()
                    }else{
                        setIsDialogOpen(true)
                    }
                }}
            >
                {isNumberVerified ? "Start a demo call" : "Verify your number"}
            </Button>
        </div></>)
}



