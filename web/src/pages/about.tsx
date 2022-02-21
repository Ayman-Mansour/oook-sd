import React from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Text,
  Flex,
  Heading,
  Stack,
  SimpleGrid,
  Link,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import ReactAudioPlayer from "react-audio-player";
import path from "path";

const About: React.FC<{}> = ({}) => {
  const router = useRouter();
  const audio_path = path.join(__dirname, "/vid/");
  return (
    <Layout>
      <Wrapper variant="regular">
        <SimpleGrid columns={2} spacing={10}>
          <p>
            <Text fontSize="lg" m={2} dir={"auto"}>
              " <b>OOK </b>: is said (<i>OOK</i>) when shouting or making voice
              or responding."
              <Text as="cite">
                <Link
                  href="https://books.google.com/books?id=b-gZAQAAIAAJ"
                  target="_blank"
                >
                  <Text fontSize="sm" textAlign="center">
                    <b>_Awn al-Sharif Gasim_</b>
                  </Text>
                </Link>
              </Text>
            </Text>
            <Text>
              The Arabic language dialects suffer from poor text and speech
              sources, due to the difficulty of obtaining them together, or
              sometimes there is no computerized source of data, which makes the
              task of collecting data very arduous.{" "}
            </Text>
            <Text>
              <Link
                href="https://oook.sd"
                target="_blank"
                rel="From oook.sd"
              >
                <b> oook.sd</b>
              </Link>{" "}
              is an initiative to enrich colloquial content (Sudanese dialect)
              to include it in future NLP research and the field of linguistics.
              The initiative aims to collect Sudanese content (speech and text)
              and enable access to it by researchers.
            </Text>
            <Text>
              The site contains 18,883 audio clips around 48 hours of Sudanese
              dialect programs and series{" "}
              <Link
                href="https://swshon.github.io/pdf/shon_2020_adi17.pdf"
                target="_blank"
                rel="From oook.sd"
              >
                <b>"source"</b>
              </Link>
              , which have been gathered, and the text corresponding to each
              audio clip will be written and collected together in a unified
              database, to allow each researcher who aims to deal with the
              Sudanese dialect in the future to overcome the data collection
              stage.
            </Text>
          </p>
          <p>
            <Text fontSize="lg" m={2} dir={"auto"}>
              "<b>عوك</b> : يقولون قول (<i>عوك</i>) أي نادي أو أحدث صوتا أو رد.{" "}
              "
              <Text as="cite" fontSize="sm">
                <Link
                  href="https://books.google.com/books?id=b-gZAQAAIAAJ"
                  target="_blank"
                >
                  {" "}
                  <Text fontSize="sm" textAlign="center">
                    <b>_عون الشريف قاسم_</b>
                  </Text>
                </Link>
              </Text>
            </Text>
            <p></p>
            <Text flex={1} mt={1} dir={"auto"}>
              تعاني لهجات اللغة العربية من فقر مصادر النصوص و الكلام ، وذلك
              لصعوبة الحصول عليهما سوياً، أو في بعض الأحيان لا يوجد مصدر محوسب
              للبيانات مما يجعل مهمة جمع البيانات صعبة ومضنية.{" "}
            </Text>
            <Text flex={1} mt={1} dir={"rtl"}>
              <Link
                href="https://oook.sd"
                target="_blank"
                rel="From oook.sd"
              >
                <b>oook.sd</b>
              </Link>{" "}
              هي مبادرة لإثراء المحتوى العامي (اللهجة السودانية) من أجل تضمينها
              مستقبلاً في بحوث معالجة اللغات الطبيعية ومجال علم اللغويات، تهدف
              المبادرة لحصر المحتوى السوداني (كلام ونصوص) وتسهيل الوصول إليه من
              قِبل الباحثين.{" "}
            </Text>
            <Text flex={1} mt={1} dir={"auto"}>
              يحتوي الموقع على 18883 مقطع صوتي تعادل تقريباً 48 ساعة من برامج
              ومسلسلات سودانية اللهجة
              <Link
                href="https://swshon.github.io/pdf/shon_2020_adi17.pdf"
                target="_blank"
                rel="From oook.sd"
              >
                <b> "المصدر"</b>
              </Link>{" "}
              ، تم حصرها وسيتم كتابة النص المقابل لكل مقطع صوتي وجمعهما معا في
              قاعدة بيانات موحدة، تتيح لكل باحث يهدف لتناول اللهجة السودانية
              مستقبلاً إجتياز مرحلة جمع البيانات.{" "}
            </Text>
          </p>
        </SimpleGrid>
        {/* <ReactAudioPlayer src={audio_path + "idoc-mock-app-en.mp4"} controls /> */}
        <Flex m={5} direction={"column"}>
          <Text fontSize="xl" fontWeight="bold" flex={1} mt={1}>
            Short Tutorial{" "}
          </Text>
          <video
            controls
            preload="metadata"
            src="/vid/short_tut.mp4"
            title="/vid//vid/short_tut.mp4"
          />
        </Flex>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(About);
