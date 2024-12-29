import {View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import {BodyScrollView} from "@/components/ui/BodyScrollView";
import { useSignUp} from "@clerk/clerk-expo";
import {useRouter} from "expo-router";
import {useState} from "react";
import {ClerkAPIError} from "@clerk/types";

export default function SignUpScreen(){
    const {signUp, setActive, isLoaded} = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<ClerkAPIError[]>([])

    const [pendingVerification, setPendingVerification] = useState(false)

    const onSignUpPress = async () => {
        if(!isLoaded) return
        setIsLoading(true)
        setErrors([])

        try {
            await signUp.create({
                emailAddress,
                password
            })

            await signUp?.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setPendingVerification(true)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }

    }

    const onVerifyPress = async () => {
        if(!isLoaded) return
        setIsLoading(true)
        setErrors([])


        try {
            const signUpAttempt = await signUp?.attemptEmailAddressVerification({
                code
            })

            if(signUpAttempt?.status === "complete") {
                await setActive({session: signUpAttempt.createdSessionId})
                router.replace("/")
            } else {
                console.log(signUpAttempt)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if(pendingVerification) {
        return (
            <BodyScrollView contentContainerStyle={{padding: 16}}>
                <TextInput
                    value={code}
                    label={`enter the verification code we sent to ${emailAddress}`}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                />
                <Button
                    onPress={onVerifyPress}
                    disabled={!code || isLoading}
                    loading={isLoading}
                >
                    Verify
                </Button>
                {errors.map((error) => (
                    <ThemedText key={error.longMessage} style={{color: "red"}}>
                        {error.longMessage}
                    </ThemedText>
                ))}
            </BodyScrollView>
        )
    }
    return (
        <BodyScrollView
            contentContainerStyle={{
                padding: 16
            }}
        >
            <TextInput
                label="Email"
                value={emailAddress}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmailAddress}
            />
            <TextInput
                label="Password"
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <Button
                onPress={onSignUpPress}
                loading={isLoading}
                disabled={!emailAddress || !password || isLoading}
            >
                Continue
            </Button>

            {errors.map((error) => (
                <ThemedText key={error.longMessage} style={{color: "red"}}>
                    {error.longMessage}
                </ThemedText>
            ))}
        </BodyScrollView>
    )
}