#!/bin/bash
SCRIPT=$( readlink -m $0)
SCRIPT_PATH=$(dirname ${SCRIPT})

/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_14.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/14/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_15.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/15/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_13.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/13/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
#/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_272.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/272/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_6.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/6/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_7.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/7/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_8.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/8/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_1.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/1/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_5.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/5/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
/usr/bin/wget --header="Accept:text/xml" -O "${SCRIPT_PATH}/route_3.xml" http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/3/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
