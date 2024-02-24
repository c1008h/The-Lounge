'use client'
import Image from "next/image";
import {NextUIProvider} from "@nextui-org/react";
import {Card, Button, Form} from '../components'

export default function Home() {
  const handleValueChange = (value: string) => {
    console.log('New value:', value);
  }; 
  return (
    <NextUIProvider className="flex min-h-screen flex-col p-24">
      <div className="flex flex-row">
        <div>

        </div>
        <div>
          <div className='bg-grey'>

          </div>
          <div className="flex flex-row">
            <Form 
              className={'bg-white shadow rounded-lg overflow-hidden'}
              onValueChange={handleValueChange}
            />
            <Button 

            />
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
