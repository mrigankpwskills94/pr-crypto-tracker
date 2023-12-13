// .../pages/CoinDetailsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const CoinDetailsScreen = ({ route }) => {
    const { coinId, selectedCurrency } = route.params;
    const screenWidth = Dimensions.get("window").width;
    const [coinData, setCoinData] = useState(null);
    const [prices, setPrices] = useState(null);
    const [isCoinDataLoading, setIsCoinDataLoading] = useState(false);

    const fetchCoinData = async () => {
        try {
            setIsCoinDataLoading(true);
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}`
            );
            setCoinData(data);
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsCoinDataLoading(false);
        }
    };

    const fetchPrices = async () => {
        try {
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${selectedCurrency}&days=1d`
            );
            setPrices(data.prices);
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        fetchCoinData();
        fetchPrices();
    }, []);

    return (
        <View style={styles.container}>
            {isCoinDataLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <>
                    <View style={styles.imageInfoContainer}>
                        <Image
                            style={styles.coinImg}
                            source={{ uri: coinData?.image.small }}
                        />
                        <View style={styles.otherDetailsContainer}>
                            <Text style={styles.otherDetails}>
                                Rank: {coinData?.market_cap_rank}
                            </Text>
                            <Text style={styles.otherDetails}>
                                Current Price:{" "}
                                {Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: selectedCurrency,
                                }).format(
                                    coinData?.market_data.current_price[
                                        selectedCurrency
                                    ]
                                )}
                            </Text>
                            <Text style={styles.otherDetails}>
                                Market Cap:{" "}
                                {Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: selectedCurrency,
                                    notation: "compact",
                                }).format(
                                    coinData?.market_data.market_cap[
                                        selectedCurrency
                                    ]
                                )}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.coinName}>{coinData?.name}</Text>
                    <Text style={styles.coinIntro}>
                        {coinData?.description.en.split(".")[0] + "."}
                    </Text>

                    {!prices ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.chartIntro}>
                                Coin Price Data for Past 24 Hours:
                            </Text>
                            <LineChart
                                data={{
                                    labels: prices
                                        .map(
                                            (price, index) =>
                                                index %
                                                    Math.ceil(
                                                        prices.length / 24
                                                    ) ===
                                                    0 &&
                                                new Date(
                                                    price[0]
                                                ).toLocaleTimeString()
                                        )
                                        .filter(Boolean),
                                    datasets: [
                                        {
                                            label: "Price",
                                            data: prices
                                                .filter(
                                                    (_, index) =>
                                                        index %
                                                            Math.ceil(
                                                                prices.length /
                                                                    24
                                                            ) ===
                                                        0
                                                )
                                                .map((price) => price[1]),
                                            borderColor: "orange",
                                            backgroundColor: "rgb(20, 22, 25)",
                                        },
                                    ],
                                }}
                                width={screenWidth * 0.9} // Set width to the screen width
                                height={400}
                                verticalLabelRotation={90}
                                yAxisLabel={`${selectedCurrency.toUpperCase()} `}
                                chartConfig={{
                                    backgroundColor: "rgb(20, 22, 25)",
                                    backgroundGradientFrom: "rgb(20, 22, 25)",
                                    backgroundGradientTo: "rgb(20, 22, 25)",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) =>
                                        `rgba(255, 165, 0, ${opacity})`,
                                    labelColor: (opacity = 1) =>
                                        `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 2,
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "1",
                                        stroke: "rgba(255, 165, 0, 0.5)",
                                    },
                                }}
                            />
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgb(20, 22, 25)",
        height: "100%",
        padding: 10,
    },
    loadingContainer: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    imageInfoContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    otherDetailsContainer: {
        marginLeft: 25,
    },
    coinImg: {
        height: 50,
        width: 50,
    },
    coinName: {
        color: "white",
        marginTop: 25,
        fontSize: 16,
    },
    coinIntro: {
        marginTop: 10,
        color: "white",
        borderWidth: 1,
        borderBottomColor: "white",
    },
    otherDetails: {
        color: "white",
    },
    chartIntro: {
        color: "white",
        marginVertical: 25,
    },
});

export default CoinDetailsScreen;
