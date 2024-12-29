import {FlatList, Platform, Pressable, StyleSheet, View} from "react-native";
import * as Haptics from "expo-haptics";

import {BodyScrollView} from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import {useClerk} from "@clerk/clerk-expo";
import {Link, router, Stack, useRouter} from "expo-router";
import {IconSymbol} from "@/components/ui/IconSymbol";
import {appleBlue, backgroundColors} from "@/constants/Colors";
import React from "react";
import {useShoppingListIds} from "@/stores/ShoppingListsStore";
import {IconCircle} from "@/components/IconCircle";
import {ThemedText} from "@/components/ThemedText";
import ShoppingListItem from "@/components/ShoppingListItem";

export default function HomeScreen(){
    const router = useRouter()
    const shoppingListIds = useShoppingListIds()
    const renderHeaderRight = () => {
        return (
            <Pressable onPress={() => router.push('/list/new')}>
                <IconSymbol name="plus" color={appleBlue} />
            </Pressable>
        )
    }
    const renderHeaderLeft = () => {
        return (
            <Pressable onPress={() => router.push('/profile')}>
                <IconSymbol name="person" color={appleBlue} />
            </Pressable>
        )
    }
    const handleNewListPress = () => {
        if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push("/list/new");
    };
    const renderEmptyList = () => (
        <BodyScrollView contentContainerStyle={styles.emptyStateContainer}>
            <IconCircle
                emoji="🛒"
                backgroundColor={
                    backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
                }
            />
            <Button onPress={handleNewListPress} variant="ghost">
                Create your first list
            </Button>
        </BodyScrollView>
    );
    const {signOut} = useClerk()
    return (
        <>
            <Stack.Screen options={{
                headerRight: renderHeaderRight,
                headerLeft: renderHeaderLeft

            }} />
                <FlatList
                    data={shoppingListIds}
                    renderItem={({item: listId}) => <ShoppingListItem listId={listId} />}
                    // renderItem={({item: listId}) => <Link href={{
                    //     pathname: '/list/[listId]',
                    //     params: {listId}
                    // }}>
                    //     <ThemedText>{listId}</ThemedText>
                    // </Link>}
                    contentContainerStyle={styles.listContainer}
                    contentInsetAdjustmentBehavior="automatic"
                    ListEmptyComponent={renderEmptyList}
                />
        </>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: 8,
    },
    emptyStateContainer: {
        alignItems: "center",
        gap: 8,
        paddingTop: 100,
    },
    headerButton: {
        padding: 8,
        paddingRight: 0,
        marginHorizontal: Platform.select({ web: 16, default: 0 }),
    },
    headerButtonLeft: {
        paddingLeft: 0,
    },
});