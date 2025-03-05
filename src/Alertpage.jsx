import {
  BackgroundImage,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Image,
  Modal,
  Text,
} from "@mantine/core";
import React, { useState,useEffect } from "react";
import Image1 from "./assets/emergency-icon.png";
import QRCode from "./assets/QR_code.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import mqtt from 'mqtt';

const Alertpage = () => {
  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState('');
  


  useEffect(() => {
    const mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      mqttClient.subscribe('React');
    });

    mqttClient.on('message', (topic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${topic}`);
      try {
        const data = JSON.parse(message.toString());
        if (data.location) {
          setLocation(data.location);
          if (!opened) setOpened(true);
        }
      } catch (error) {
        console.error('Invalid JSON data:', error);
      }
    });

    return () => {
      mqttClient.end();
    };
  }, [opened]);

  return (
    <>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage:
            "url('https://media.istockphoto.com/id/1216282380/photo/abstract-cyberspace-concept.jpg?s=612x612&w=0&k=20&c=-LnnoA9Tzi2mpsD0661hioOsprgmhMaJyBzM-vaeloU=')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        ></div>
      </div>


      <Container
        fluid
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Center style={{ flexDirection: "column", textAlign: "center" }}>
          <Image src={Image1} width={150} />
          <Text
            fw={700}
            mt="lg"
            style={{
              color: "white",
              fontSize: "35px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Help is on its way with just a TAP!
          </Text>
          {/* <Button
            mt="xl"
            size="md"
            color="blue"
            radius="md"
            onClick={() => setOpened(true)}
          >
            Show Details
          </Button> */}
        </Center>
      </Container>


      <Modal
        opened={opened && location}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        size="lg"
        centered
        overlayProps={{ backgroundOpacity: 0.6, blur: 2 }}
        styles={{
          content: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "15px",
            maxWidth: "90vw",

          },
          body: {
            padding: 0,
          },
        }}
      >
        <Card
          shadow="lg"
          padding="lg"
          h="20rem"
          radius="lg"
          style={{
            maxWidth: "600px",
            width: "100%",
            borderRadius: "12px",
            backgroundColor: "white",
            border: "none",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              textAlign: "center",
            }}
          >

            <div style={{ padding: "3.5rem", textAlign: "center" }}>
              <Text fw={700} fz="22px">Name</Text>
              <Text fw={700} fz="22px" mt="md">Contact No.</Text>
              <Text fw={700} fz="22px" mt="md">Tag ID</Text>
              {/* <Text fw={700} fz="22px" mt="md">Location</Text> */}
              <Text fw={700} fz="22px" mt="md">Location:{location}</Text>
          {location && (
            <a
              href={location}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <FaMapMarkerAlt size={24} />
            </a>
          )}
            </div>


            <Divider
              orientation="vertical"
              size="md"
              style={{
                height: "90%",
                alignSelf: "center",
              }}
            />


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Image src={QRCode} width={150} />
              <Text mt="sm" fz="16px" fw={600}>
                Scan QR for details
              </Text>
            </div>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default Alertpage;
